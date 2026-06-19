
const createCircuitBreaker = (serviceType) => {
    let circuitState = "CLOSED";
    let failureCount = 0;
    const FAILURE_THRESHOLD = 3;
    const RESET_TIMEOUT = 30000;
    let nextAttemptTime = Date.now();

    const canRequest = () => {

        if(circuitState === "OPEN") {

            if(Date.now() > nextAttemptTime) {

                failureCount = 0;
                circuitState = "HALF_OPEN";
                console.log(` ${serviceType} Circuit moved to HALF_OPEN`);
                
                return true;
            }

            return false;
        }

        return true;
    };


    const recordSuccess = () => {

        failureCount = 0;

        if(circuitState === "HALF_OPEN"){
            console.log(
                "HALF_OPEN → CLOSED"
            );
        }
        
        circuitState = "CLOSED";

        console.log(`${serviceType} Circuit CLOSED`);
    };

    const recordFailure = () => {

        failureCount++;

        console.log(`Failure Count: ${failureCount}`);

        if(failureCount >= FAILURE_THRESHOLD) {

            circuitState = "OPEN";
            nextAttemptTime = Date.now() + RESET_TIMEOUT;

            console.log(`${serviceType} Circuit OPEN`);
        }
    };

    const getCircuitStatus = () => {
        return circuitState;
    }

    // console.log(
    //     `${serviceType} Breaker Created`
    // );

    return {
        canRequest,
        recordSuccess,
        recordFailure,
        getCircuitStatus
    };
};

module.exports = createCircuitBreaker;