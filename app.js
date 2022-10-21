function getRandomValue(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

const app = Vue.createApp({
    data()
    {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            rounds: 0,
            winner: null,
            logsMsg:[],
            cooldown: 0
        };
    },

    methods:
    {
        weakAttack(){
            this.rounds++;
            const hitValue= getRandomValue(5,12);
            this.monsterHealth-=hitValue;
            this.battleLog('Hero','Attack',hitValue +" damage");
            if(this.cooldown!=0){
                this.cooldown--;
            } 
            this.deflectDmg();
        },
        criticalHit(){  
            this.rounds++;
            this.cooldown=3;
            const hitValue= getRandomValue(10,25 );
            this.monsterHealth-=hitValue;
            this.battleLog('Hero','Heavy Attack',hitValue +" damage");
            this.deflectDmg();
        },
        deflectDmg()
        {
            const hitValue= getRandomValue(8,15);
            this.playerHealth-=hitValue;
            this.battleLog('Monster','Attack',hitValue+" damage");
        },
        healingBuff()
        {
            this.rounds++;
            const healing=getRandomValue(8,20);
            if(this.playerHealth+healing>100)
            {
                this.playerHealth=100;
            }   
            else{
                this.playerHealth+=healing;
                this.battleLog('Hero','Heal',healing+" HP");
            }
            this.deflectDmg();
        },

        newGame(){
            this.playerHealth=100;
            this.monsterHealth=100;
            this.rounds=0;
            this.winner=null;
            this.cooldown=0;
            this.logsMsg=[];
        },

        loser(){
            this.winner='monster'
        },

        battleLog(attacker,action,value)
        {
            this.logsMsg.unshift({
                actionBy: attacker,
                actionType: action,
                actionValue: value
            });
        }
    },

    computed:
    {
        monsterHB()
        {
            if(this.monsterHealth<=0){
                return {width:'0%'};
            }else {
                return {width: this.monsterHealth+'%'};
            }
        },

        heroHB()
        {
            if(this.playerHealth<=0){
                return {width: '0%'};
            } else{
                return {width: this.playerHealth+'%'};
            }
        },

        specialCooldown(){
            return this.cooldown!==0;
        }       
    },

    watch: {

        playerHealth(value){
            if(value <= 0 && this.monsterHealth<=0){
                //Draw
                this.winner='draw';
            } else if(value <=0){
                //hero lost
                this.winner='monster';
            }
        },

        monsterHealth(value){
            if(value<=0 && this.playerHealth<=0){
                //draw
                this.winner='draw';
            } else if(value<=0){
                //monster lost
                this.winner='hero';
            }
        }
    }
});

app.mount('#game');