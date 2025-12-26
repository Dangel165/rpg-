/*:
 * @target MZ
 * @plugindesc 특정 SV 캐릭터 이미지 전투 중 idle 프레임 고정
 * @author Dangel
 *
 * @param Character File
 * @text 캐릭터 파일명
 * @type string
 * @default $drowing
 *
 * @param Frame X
 * @text 고정 프레임 X
 * @type number
 * @default 0
 *
 * @param Frame Y
 * @text 고정 프레임 Y
 * @type number
 * @default 0
 *
 * @help
 * img/sv_actors 폴더의 특정 SV 캐릭터 이미지 파일을 기준으로
 * idle 애니메이션만 고정합니다. 공격/스킬 애니메이션은 그대로 동작.
 */

(() => {
    const parameters = PluginManager.parameters("SVActorIdleFix");
    const charFile = String(parameters["Character File"] || "$drowing");
    const frameX = Number(parameters["Frame X"] || 0);
    const frameY = Number(parameters["Frame Y"] || 0);

    const _Sprite_Actor_updateCharacterFrame = Sprite_Actor.prototype.updateCharacterFrame;

    Sprite_Actor.prototype.updateCharacterFrame = function() {
        // 파일명 기준 캐릭터 선택
        if (this._characterName === charFile) {
            // idle 상태 판단
            const idle = !this._actor.isInputting() && !this._actor.isActing() && !this._actor.isMotionRequested();
            if (idle) {
                // 매 프레임 강제로 지정 프레임으로 set
                this.setFrame(frameX * this._tileWidth, frameY * this._tileHeight, this._tileWidth, this._tileHeight);
                return;
            }
        }
        _Sprite_Actor_updateCharacterFrame.call(this);
    };
})();
