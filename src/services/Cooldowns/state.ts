interface ICommandCooldownData {
  overrideCooldown: number;
}

type UserId = string;

type TCooldownData = Map<string, ICommandCooldownData>;
type TUserCooldownData = Map<UserId, TCooldownData>;

class CooldownState {
  private _userCooldowns: TUserCooldownData;

  public constructor() {
    this._userCooldowns = new Map();
  }

  private checkAndCreateUserCooldownData(userId: UserId): void {
    if (!this._userCooldowns.has(userId)) {
      this._userCooldowns.set(userId, new Map());
    }
  }

  public getUserData(
    userId: string,
    commandName: string
  ): ICommandCooldownData | undefined {
    this.checkAndCreateUserCooldownData(userId);

    const userCooldowns = this._userCooldowns.get(userId);

    return userCooldowns?.get(commandName);
  }

  public setUserCustomCooldown(
    userId: UserId,
    commandName: string,
    overrideCooldown: number
  ): void {
    this.checkAndCreateUserCooldownData(userId);

    const userCooldowns = this._userCooldowns.get(userId);

    userCooldowns?.set(commandName, { overrideCooldown });
  }
}

const stateSingleton = new CooldownState();

export default stateSingleton;
