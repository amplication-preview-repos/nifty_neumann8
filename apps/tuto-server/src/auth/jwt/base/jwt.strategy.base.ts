import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IAuthStrategy } from "../../IAuthStrategy";
import { ProjectInfo } from "../../ProjectInfo";
import { ProjectService } from "../../../project/project.service";

export class JwtStrategyBase
  extends PassportStrategy(Strategy)
  implements IAuthStrategy
{
  constructor(
    protected readonly secretOrKey: string,
    protected readonly projectService: ProjectService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: ProjectInfo): Promise<ProjectInfo> {
    const { username } = payload;
    const user = await this.projectService.project({
      where: { username },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      !Array.isArray(user.roles) ||
      typeof user.roles !== "object" ||
      user.roles === null
    ) {
      throw new Error("User roles is not a valid value");
    }
    return { ...user, roles: user.roles as string[] };
  }
}
