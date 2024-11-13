import { FastifyPluginAsync } from "fastify";
import path from "path";
import { PrismaUserRepository } from "@infra/repositories/user/prisma-user.repository";
import {
  ForgotPasswordUseCase,
  ForgotPasswordDTO,
  ForgotPasswordRequest,
} from "@app/auth/forgot-password";
import {
  ResetPasswordUserDTO,
  ResetPasswordUserRequest,
  ResetPasswordUserUseCase,
} from "@app/auth/reset-password";
import { NodemailerProvider } from "@infra/adapters/email";
import { JwtProvider } from "@infra/adapters/token";
import { LoginDTO, LoginRequest, LoginUseCase } from "@app/auth/login";
import { StatusCodes } from "http-status-codes";
import {
  RegisterUserDTO,
  RegisterUserRequest,
  RegisterUserUseCase,
} from "@app/auth/register";
import { TriggeredBySystem } from "@domain/triggered-by";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";

interface Handler<T extends RouteGenericInterface = RouteGenericInterface> {
  (
    request: FastifyRequest<T>,
    response: FastifyReply<T>
  ): Promise<{ message: string; payload: Record<string, unknown> }>;
}

class AuthController {
  constructor(
    private registerUC: RegisterUserUseCase,
    private loginUC: LoginUseCase,
    private forgotPasswordUC: ForgotPasswordUseCase,
    private resetPasswordUC: ResetPasswordUserUseCase
  ) {}

  register(): Handler {
    return async (request, reply) => {
      const data = request.body as RegisterUserDTO;
      const dto = RegisterUserRequest.create(new TriggeredBySystem(), data);
      const result = await this.registerUC.execute(dto);

      if (result.isLeft())
        return {
          message: result.value.message,
          payload: {
            isAutheticated: false,
            error: result.value,
          },
        };

      const user = result.value;

      reply.status(StatusCodes.CREATED);
      return {
        message: "User created successfully!",
        payload: {
          isAuthenticated: true,
          user: user.flat(),
        },
      };
    };
  }

  login(): Handler {
    return async (request, reply) => {
      const data = request.body as LoginDTO;
      const dto = LoginRequest.create(new TriggeredBySystem(), data);
      const result = await this.loginUC.execute(dto);

      if (result.isLeft())
        return {
          message: result.value.message,
          payload: {
            isAutheticated: false,
            error: result.value,
          },
        };

      const user = result.value;

      request.session.user = { id: user.id.value };

      reply.code(StatusCodes.OK);

      return {
        message: "User Logged In!",
        payload: {
          isAuthenticated: true,
          user: user.flat(),
        },
      };
    };
  }

  forgotPassword(): Handler {
    return async (request) => {
      const data = request.body as ForgotPasswordDTO;
      const dto = ForgotPasswordRequest.create(new TriggeredBySystem(), data);

      const result = await this.forgotPasswordUC.execute(dto);

      if (result.isLeft())
        return {
          message: result.value.name,
          payload: {
            error: result.value,
          },
        };

      return {
        message: result.value,
        payload: {},
      };
    };
  }

  resetPassword(): Handler<{
    Params: Pick<ResetPasswordUserDTO, "token">;
    Body: Omit<ResetPasswordUserDTO, "token">;
  }> {
    return async (request, reply) => {
      const data = {
        token: request.params.token,
        ...request.body,
      } as ResetPasswordUserDTO;

      const dto = ResetPasswordUserRequest.create(
        new TriggeredBySystem(),
        data
      );

      const result = await this.resetPasswordUC.execute(dto);

      if (result.isLeft())
        return {
          message: result.value.name,
          payload: {
            error: result.value,
          },
        };

      const ok = result.value;

      if (!ok) return reply.status(404);

      return {
        message: "Password Updated successfully!",
        payload: {},
      };
    };
  }
}

const folder = path.basename(__dirname);
export const autoPrefix = `/${folder}`;

const auth: FastifyPluginAsync = async (fastify) => {
  const usersRepo = new PrismaUserRepository(fastify.prisma.user);
  const jwtProvider = new JwtProvider<{ userId: string }>(fastify.jwt);
  const nodemailerProvider = new NodemailerProvider();
  const authController = new AuthController(
    new RegisterUserUseCase(usersRepo, nodemailerProvider),
    new LoginUseCase(usersRepo),
    new ForgotPasswordUseCase(usersRepo, jwtProvider, nodemailerProvider),
    new ResetPasswordUserUseCase(usersRepo, jwtProvider, nodemailerProvider)
  );

  fastify.post("/register", authController.register());
  fastify.post("/login", authController.login());
  fastify.post("/forgot-password", authController.forgotPassword());
  fastify.put("/reset-password/:token", authController.resetPassword());

  fastify.get("/session", async (request) => {
    return { isAuthenticated: !!request.session.user };
  });

  fastify.get("/logout", async (request, reply) => {
    request.session.destroy();
    reply.code(StatusCodes.ACCEPTED);
  });
};

export default auth;
