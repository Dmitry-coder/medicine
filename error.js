class ApplicationError extends Error {
    constructor(error) {
        super(error.message);
        this.code = error.code;
        this.param = error.param;
    }

    get statusCode() {
        return this.code;
    }

    jsonFriendly() {
        return {
            error: {
                code: this.statusCode,
                message: this.message,
                param: this.param,
            },
        };
    }
}

class DoctorError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

class AuthError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

class MeasurementError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

class ViewError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

class AliveViewError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

class DataMeasureError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

class DeleteError extends ApplicationError {
    constructor(error) {
        super(error);
    }
}

const handleError = (error, request, response, next) => {
    if ((error instanceof AuthError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    if ((error instanceof MeasurementError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    if ((error instanceof ViewError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    if ((error instanceof AliveViewError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    if ((error instanceof DataMeasureError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    if ((error instanceof DoctorError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    if ((error instanceof DeleteError)) {
        response.status(error.code).json(error.jsonFriendly());
        return;
    }
    console.error(error);
    response.status(500).json({
        error: {
            code: 500,
            message: `${error.name} - ${error.message}`,
        },
    });
};

export default {
    DoctorError,
    AuthError,
    MeasurementError,
    ViewError,
    DeleteError,
    AliveViewError,
    DataMeasureError,
    handleError,
};