/*
  =========================
  ParadigmCore: Blind Star
  Timestamp.ts @ {rebalance-refactor}
  =========================
  
  @date_inital 10 October 2018
  @date_modified 16 October 2018
  @author Henry Harder

  Dumb class for creating a log timestamp.
*/

export class Timestamp extends Date {
    constructor(){
        super();
    }

    public logFormat() {
        
        return `${Math.floor(Date.now()/1000).toString()}.${Date.now().toString().slice(-3)}`;
    }
}