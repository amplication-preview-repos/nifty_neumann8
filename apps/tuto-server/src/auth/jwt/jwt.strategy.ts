import { Inject, Injectable } from "@nestjs/common";
import { JWT_SECRET_KEY_PROVIDER_NAME } from "../../constants";
import { JwtStrategyBase } from "./base/jwt.strategy.base";
import { ProjectService } from "../../project/project.service";

@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(
    @Inject(JWT_SECRET_KEY_PROVIDER_NAME) secretOrKey: string,
    protected readonly projectService: ProjectService
  ) {
    super(secretOrKey, projectService);
  }
}
