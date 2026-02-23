export function ProfilePanel({ player, sceneDef }: { player: any, sceneDef: any }) {
    return (
      <div className="scroll-card">
        <div>道号：{player?.name ?? "未知"}</div>
        <div>所在：{sceneDef?.name ?? "未知"}</div>
        <div>
          年龄：{player?.age ?? 0} / {player?.lifespan ?? 0}
        </div>
      </div>
    );
  }