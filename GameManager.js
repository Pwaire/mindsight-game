export class GameManager{

    _roundCount = 10;
    _currentRound = 0;
    _succeededCount = 0;
    _roundResults = new Array(this._roundCount).fill(null).map(() => ({ success: false, shape: null }));
    
        reset() {
        this._succeededCount = 0;
        this._currentRound = 0;
        this._roundResults = new Array(this._roundCount).fill(null).map(() => ({ success: false, shape: null }));
    }

     setCurrentRoundSuccess(success) {
        this._roundResults[this._currentRound].success = success;
    }

     setCurrentRoundShape(shape) {
        this._roundResults[this._currentRound].shape = shape;
    }

 debugSuccessRound() {
    for (let index = 0; index < this._roundResults.length; index++) {
        const { success, shape } = this._roundResults[index];
        console.log(`Round ${index + 1}: success=${success}, shape=${shape ? shape.name : 'none'}`);
    }
}


    increasePoint(){
        this._succeededCount++;
    }

    increaseRound(){
        this._currentRound++;
    }

  get currentRound() {
        return this._currentRound;
    }

    get roundCount() {
        return this._roundCount;
    }

    get succeededCount() {
        return this._succeededCount;
    }

    get roundResults() {
        return this._roundResults;
    }
}