import { UseCaseRequest } from "@app/shared";
import { InvalidParameterException } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";

export interface ApplyForJobUserDTO {
  userId: string;
  jobId: string;
  appliedAt: Date;
  status: "pending" | "rejected" | "accepted";
  message?: string;
}

export class ApplyForJobUserRequest
  extends UseCaseRequest
  implements ApplyForJobUserDTO
{
  constructor(
    triggeredBy: TriggeredBy,
    public readonly userId: string,
    public readonly jobId: string,
    public readonly appliedAt: Date,
    public readonly status: "pending" | "rejected" | "accepted" = "pending",
    public readonly message?: string | undefined
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    dto: ApplyForJobUserDTO
  ): ApplyForJobUserRequest {
    return new ApplyForJobUserRequest(
      triggeredBy,
      dto.userId,
      dto.jobId,
      dto.appliedAt,
      dto.status,
      dto.message
    );
  }

  protected validateImpl(): void {
    if (this.userId == null) {
      throw new InvalidParameterException("User id must be provided");
    }
  }
}
