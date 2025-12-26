/*:
 * @target MZ
 * @plugindesc 타이틀 화면 게임 제목을 중앙 상단에 표시하고 커맨드 창 위치 조정
 * @author Dangel
 *
 * @help
 * 게임 제목을 타이틀 화면 중앙 상단에 표시하며,
 * 커맨드 창은 화면 아래 중앙에 배치합니다.
 */

(() => {
    // Scene_Title - 글자 표시
    const _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function() {
        _Scene_Title_createForeground.call(this);

        // 게임 제목 스프라이트가 없으면 생성
        if (!this._gameTitleSprite) {
            this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
            this.addChild(this._gameTitleSprite);
        }

        this.drawGameTitle();
    };

    Scene_Title.prototype.drawGameTitle = function() {
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.clear();
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.outlineColor = "black";
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 72;

        const text = $dataSystem.gameTitle || "게임 제목";
        const x = 0;
        const maxWidth = Graphics.width;
        const lineHeight = 72;

        // 중앙 상단 위치
        const y = Graphics.height / 10; // 화면 높이의 1/8 위치

        bitmap.drawText(text, x, y, maxWidth, lineHeight, "center");
    };

    // Scene_Title - 커맨드 창 위치
    Scene_Title.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);

        const wx = (Graphics.boxWidth - ww) / 2;      // 중앙
        const wy = Graphics.boxHeight - wh - 50;      // 아래에서 50px 위

        return new Rectangle(wx, wy, ww, wh);
    };
})();
