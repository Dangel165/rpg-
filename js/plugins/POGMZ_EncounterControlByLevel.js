//=============================================================================
// POGMZ_EncounterControlByLevel.js v1
//=============================================================================
/*:
 * @plugindesc  Evita batalha dependendo do nivel da Party e da Tropa inimiga.
 * @author DadoCWB
 * @url https://tecnoanlogica.itch.io
 * @help POGMZ_EncounterControlByLevel.js v.01 update: 24/09/2023 
 * 
 * @help POGMZ_EncounterControlByLevel
 * Contexto:
 * Em jogos com batalhas randômicas ou aleatórias, muitas vezes o jogador é 
 * obrigdao a enfrentar batalhas que não influenciam em nada no avanço do 
 * jogo. Pior ainda quando o grupo do jogador precisa enfrentar um desafio 
 * muito mais forte ou extremamente fraco. Esses são tipos de situação que 
 * quebram o ritmo do jogo e por vezes levam  o jogador ao tédio e por 
 * consequencia a desistir do jogo. 
 * 
 * Descrição:
 * Esse script permite ao desenvolvedor controlar os encontros randômicos de forma
 * a arvitar que o jogador enfrente adversários muito fracos ou muito mais fortes
 * que ele. 
 * 
 * 
 * Conceitos usados nesse script:
 * I) Nível do grupo:
 * É a soma do nível de todos os personages que fazem parte do grupo do jogador; 
 * 
 * II) Nivel da Tropa Inimiga: 
 * É o nível estabalecedio pelo desenvolvedor para uma tropa. Isso é feito 
 * adicionando uma tag após o nome da tropa. 
 * 
 * Exemplo:  Para  especificar que uma tropa é de nível 23 basta adicioanr a 
 * tag  <Lv:23>.
 * 
 * IV) Diferença mínimia: 
 * E o valor usado para calcular o  menor nível de tropa que o grupo do jogador 
 * pode encontrar em uma batalha aleatória. 
 * 
 * Exemplo: Suponha que o valor estabelecido para a diferença mínima seja 3 e
 * o nível do grupo de jogadores seja 8. Fazendo a conta 8-3=5 temos que o
 * grupo do jogador so irá enfrentar tropas inimigas cujo nível seja maior 
 * que 5.
 * 
 * 
 * V) Diferença máxima: 
 * É o valor usado para calcular o maior nível é o maior nível de uma tropa inimiga
 *  que o grupo do jogadore pode encontrar em uma batalha aleatória.
 * 
  * Exemplo: Suponha que o valor estabelecido para a diferença máxima seja 5 e
 * o nível do grupo de jogadores seja 8. Fazendo a conta 8+5=13, temos que o
 * grupo do jogador so irá enfrentar tropas inimigas cujo nível seja até 13. 
 * 
 * 
 * VI) Nível Máximo e Nível Mínimo:
 * São respectivamente o menor e maior nível das tropas inimigas que o jogador 
 * pode encontrar em uma batalha randômica. Gráficamente pode ser representado:
 * 
 *            Lv min              Lv               Lv max
 *          ----|------------------|------------------|------->
 * 
 *                 Lv - diff min      Lv + diff max
 * 
 * 
 * 
 * Configuração do Plugin:
 * 
 * A1) Escolha uma variável do banco de dados que irá armazenar a diferença máxima
 * entre os níveis do grupo do jogador e da tropa inimiga  na qual pode ocorrer a
 * o encontro entre eles. 
 * 
 * A2) Atribua o valor inicial par a avariável especificada em (A1). Esse valor pode
 * ser alterando posteriormente apenas mudando o valor da variável do database.
 * 
 * @param Game Variable
 * 
 * @param maxLvVarId
 * @text A1: Max Lv Diff (Game Variable)
 * @desc Variável cujo valor armazenado determina a diferença MÁXIMA entre níveis (da party e da tropa) na qual é possível ocorrer encontro.
 * @type variable
 * @default 1
 * @parent Game Variable
 * 
 * @param maxValue
 * @text A2: Value MaxLv Diff
 * @desc Valor inicial da MÁXIMA diferença entre os níveis entre a party do jogador e a tropa inimiga.
 * @type number
 * @default 10
 * @parent maxLvVarId
 * 
 * @param minLvVarId
 * @text B1: Min Lv Diff (Game Variable)
 * @desc Variável cujo valor armazenado determina a diferença MÍNIMA entre níveis (da party e da tropa) na qual é possível ocorrer encontro.
 * @type variable
 * @default 2
 * @parent Game Variable
 * 
 * @param minValue
 * @text B2: Value MinLv Diff
 * @desc Valor inicial da MÍINIMA diferença entre os níveis entre a party do jogador e a tropa inimiga.
 * @type number
 * @default 3
 * @parent minLvVarId
 */

var Imported = Imported || {};
Imported.PPOGMZ_EncounterControlByLevel  = true;
var DadoCWB = DadoCWB || {};
DadoCWB.POG = DadoCWB.POG || {};


(() => {

    const pluginName = "POGMZ_EncounterControlByLevel";
    const parameters = PluginManager.parameters(pluginName);    
    var rotationOnOff   = true;

    DadoCWB.POG.maxLvVarId  = Number(parameters.maxLvVarId);
    DadoCWB.POG.minLvVarId  = Number(parameters.minLvVarId);
    DadoCWB.POG.maxValue  = Number(parameters.maxValue);
    DadoCWB.POG.minValue  = Number(parameters.minValue);

    //-----------------------------------------------------------------------------
    // Game_Player
    //-----------------------------------------------------------------------------
    var _lvDiff_Game_Player  = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        _lvDiff_Game_Player.call(this);
        $gameVariables.setValue(DadoCWB.POG.maxLvVarId, DadoCWB.POG.maxValue );
        $gameVariables.setValue(DadoCWB.POG.minLvVarId, DadoCWB.POG.minValue );
    };

    //-----------------------------------------------------------------------------
    // Game_Party
    //-----------------------------------------------------------------------------
    Game_Party.prototype.lvParty = function() {
        let lv = 0;
        for (const battler of $dataSystem.testBattlers) {
            lv+=battler.level;
        }
        return lv;
    };

    Game_Party.prototype.minLevel=function(){
        return $gameParty.lvParty() - $gameVariables.value(DadoCWB.POG.minLvVarId);
    };

    Game_Party.prototype.maxLevel=function(){
        return $gameParty.lvParty() + $gameVariables.value(DadoCWB.POG.maxLvVarId);
    };

    //-----------------------------------------------------------------------------
    // Game_Troop
    //-----------------------------------------------------------------------------
    Game_Troop.prototype.lvTroop = function(troopId) {
        const troop     = $dataTroops[troopId];
        const nome      =  troop.name;
        const tag       = "<Lv:"
        const index     = nome.indexOf(tag);
        let num ="";

        if (index >=0){
            let i=index+tag.length;
            while(nome[i]!='>'){
                num+=nome[i];
                i++;
            }
            return Number(num);
        }
        return $gameParty.lvParty();
    };
    //-----------------------------------------------------------------------------
    // Game_Player
    //-----------------------------------------------------------------------------
    Game_Player.prototype.meetsEncounterConditions = function(encounter) {
        const min       = $gameParty.minLevel();
        const max       = $gameParty.maxLevel();
        const lvTroop   = $gameTroop.lvTroop(encounter.troopId); 
        if( lvTroop < min || lvTroop > max){
            return false;
        }
        return (
            encounter.regionSet.length === 0 || encounter.regionSet.includes(this.regionId())
        );
    };

    Game_Player.prototype.makeEncounterTroopId = function() {
        const encounterList = [];
        let weightSum = 0;
        for (const encounter of $gameMap.encounterList()) {
            if (this.meetsEncounterConditions(encounter)) {
                encounterList.push(encounter);
                weightSum += encounter.weight;
            }
        }
        if (weightSum > 0) {
            let value = Math.randomInt(weightSum);
            for (const encounter of encounterList) {
                value -= encounter.weight;
                if (value < 0) {
                    return encounter.troopId;
                }
            }
        }
        return 0;
    };
})(); 