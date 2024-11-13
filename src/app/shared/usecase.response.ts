import { Either, Result } from '@domain/shared/core/logic';

type UseCaseResponse<L = Error, A = NonNullable<unknown>> = Either<Result<L>, Result<A>>;

export { UseCaseResponse };
