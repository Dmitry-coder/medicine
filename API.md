# Medicine API

## Doctor auth. POST: /api/auth

### Parameters:

```ts
{
    body: {
        login: string     // doctor login
        password: string  // doctor password
    }
}
```

### Response (200 OK):

```ts
{
    token: "Bearer 74245j5usdfh34.89763gd34786384.6343684thjgsd" // example
}
```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Doctor with such login does not exist"
        param: {
            name: "login"
        }
    }
}
```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Wrong doctor password"
        param: {
            name: "password"
        }
    }
}
```

## Doctor info. GET: /doctor/:id

### Parameters:

- id: number (doctor id).

```ts
{
    headers: {
        authentication: "Bearer 74245j5usdfh34.89763gd34786384.6343684thjgsd" // example
    }
}
```

### Response (200 OK):

```ts
{
    id: number               // doctor's id
    name: string             // doctors's name
    specialization: string   // doctor's specialization
}
```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Unauthorized"
    }
}
```

### Response (404 Resource Not Found):

```ts
{
    error: {
        code: 404
        message: "Doctor was not found"
        param: {
            name: "id"
        }
    }
}
```

## Measurement creation. POST: /api/measurement

### Parameters:

```ts
{
    headers: {
        auth: "Bearer 74245j5usdfh34.89763gd34786384.6343684thjgsd" // example
    }
    body: {
        deviceId: string  // device id
        patientId: number // patient id
    }
}
```

### Response (200 OK):

```ts
{
    id: string             // measurement id
    startTimestamp: null   // date and time when mesurement is started (not started at this moment) 
    patientId: number      // linked patient id 
    deviceId: string       // linked device id 
    isFinished: boolean    // is data pushing forbidden or not
}
```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Unauthorized"
    }
}
```

### Response (404 Resource Not Found, patient):

```ts
{
    error: {
        code: 404
        message: "Patient was not found"
        param: {
            name: "patientId"
        }
    }
}
```

### Response (404 Resource Not Found, device):

```ts
{
    error: {
        code: 404
        message: "Device was not found"
        param: {
            name: "deviceId"
        }
    }
}
```

### Response (409 Conflict):

```ts
{
    error: {
        code: 409
        message: "Device is busy"
        param: {
            name: "deviceId"
        }
    }
}
```

## Client-device linking. POST: /api/device/linking

### Parameters:

```ts
{
    body: {
        deviceId: string       // measurement id
        macAddress: string     // client mac address
    }
}
```

### Response (200 OK):

```ts
{
    id: string                    // device id
    name: string                  // device name 
    macAddress: string            // linked client mac address
    measurementId: string | null  // linked measurement id (null, if measurement is not linked at this moment)
}
```

### Response (404 Resource Not Found):

```ts
{
    error: {
        code: 404
        message: "Device was not found"
        param: {
            name: "deviceId" // device id
        }
    }
}
```

### Response (405 Method Not Allowed):

```ts
{
    error: {
        code: 405
        message: "Measurement is finished"
        param: {
            name: "deviceId" // device id
        }
    }
}
```

### Response (409 Conflict):

```ts
{
    error: {
        code: 409
        message: "Device is already linked"
        param: [
            {
                name: "deviceId"   // device id
            },
            {
                name: "macAddress" // client mac address
            }
        ]
    }
}
```

## Client-device unlinking. POST: /api/device/unlinking

### Parameters:

```ts
{
    body: {
        deviceId: string       // measurement id
        macAddress: string     // client mac address
    }
}
```

### Response (200 OK, mac is null or equals to macAddress parameter):

```ts
{
    id: string             // device id
    name: string           // device name 
    macAddress: null       // linked client mac address (should be null at this moment)
    measurementId: null    // linked measurement id (should be null at this moment)
}
```

### Response (403 Forbidden, mac is not null but not equals to macAddress parameter):

```ts
{
    error: {
        code: 404
        message: "MAC is not linked"
        param: {
            name: "macAddress" // client mac address
        }
    }
}
```

### Response (404 Resource Not Found):

```ts
{
    error: {
        code: 404
        message: "Device was not found"
        param: {
            name: "deviceId" // device id
        }
    }
}
```

## Measurement data pushing. PUT: /api/measurement/data

### Parameters:

```ts
{
    measurementId: string  // measurement id
    macAddress: string     // client mac address
    timestamp: Date        // data creation date and time
    data: {                // data self (null, if measurement is finished)
        pa: [any]       // a, b, ..., n - any uint
        pb: [any]
        pn: [any]
    }
|
    null
}
```

### Response (200 | 400):

```ts
{   code: 200|400
    details: [
        {
            parameter: "p1",
            result: {
                code: 200 | 400,
                message: "Invalid type" | "Unknown data type" | undefined
            }
        },
        {
            parameter: "p2",
            result: {
                code: 200 | 400,
                message: "Invalid type" | "Unknown data type" | undefined
            }
        }//, etc.
        ] | undefined  
}
```

### Response (403 Forbidden):

```ts
{
    error: {
        code: 403
        message: "MAC is not linked"
        param: {
            name: "macAddress" // client mac address
        }
    }
}
```

### Response (404 Resource Not Found):

```ts
{
    error: {
        code: 404
        message: "Measurement was not found"
        param: {
            name: "measurementId" // measurement id
        }
    }
}
```

### Response (405 Method Not Allowed):

```ts
{
    error: {
        code: 405
        message: "Measurement is finished"
        param: {
            name: "measurementId" // device id
        }
    }
}
```

## Measurement info. GET: /api/measurement/:id

### Parameters:

- id: string

```ts
{
    headers: {
        auth: "Bearer 74245j5usdfh34.89763gd34786384.6343684thjgsd" // example
    }
}
```

### Response (200 OK):

```ts
{
    id: string                    // measurement id
    startTimestamp: Date | null   // date and time when measurement is started 
    patientId: number             // linked patient id 
    deviceId: string              // linked device id 
    isFinished: boolean           // is data pushing forbidden or not
    params: [string]              // measurement params at this moment
}
```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Unauthorized"
    }
}
```

### Response (404 Resource Not Found):

```ts
{
    error: {
        code: 404
        message: "Measurement was not found"
        param: {
            name: "measurementId" // measurement id
        }
    }
}
```

## Measurement viewing. GET: /api/measurement/:measurementId/data/:param

### Parameters:

- measurementId: string;
- param: string (param_name ("p1" | "p2" | "p3" | ...)).

```ts
{
    headers: {
        auth: "Bearer 74245j5usdfh34.89763gd34786384.6343684thjgsd" // example
    }
}
```

### Response (200 OK):

```ts
{
    id: string                    // measurement id
    startTimestamp: Date | null   // date and time when measurement is started 
    patientId: number             // linked patient id 
    deviceId: string              // linked device id 
    isFinished: boolean           // is data pushing forbidden or not
    paramName: string             // measurement param name
    data: [{                      // measurement param data
        timestamp: Date,
        data: string              // JSON.stringify([any])
    }]
}

```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Unauthorized"
    }
}
```

### Response (404 Resource Not Found, measurement):

```ts
{
    error: {
        code: 404
        message: "Measurement was not found"
        param: {
            name: "measurementId" // measurement id
        }
    }
}
```

### Response (404 Resource Not Found, param):

```ts
{
    error: {
        code: 404
        message: "Param was not found"
        param: [
            {
                name: "measurementId" // measurement id
            },
            {
                name: "param"         // param name
            }
        ]
    }
}
```

## Measurement live viewing. GET: /api/measurement/:measurementId/data/live/:param

### Parameters:

- measurementId: string;
- param: string (param_name ("p1" | "p2" | "p3" | ...)).

```ts
{
    headers: {
        auth: "Bearer 74245j5usdfh34.89763gd34786384.6343684thjgsd" // example
    }
}
```

### 1-st response (200 OK):

```ts
{
    id: string                    // measurement id
    startTimestamp: Date | null   // date and time when measurement is started 
    patientId: number             // linked patient id 
    deviceId: string              // linked device id 
    isFinished: boolean           // is data pushing forbidden or not
    paramName: string             // measurement param name
    data: [{                      // measurement param data
        timestamp: Date,
        data: string              // JSON.stringify([any])
    }]
}
``` 

### N-th response (200 OK):

```ts
{
    isFinished: boolean     // is data pushing forbidden or not
    data: [{                // measurement param new data
        timestamp: Date,
        data: string        // JSON.stringify([any])
    }]
}

```

### Response (401 Unauthorized):

```ts
{
    error: {
        code: 401
        message: "Unauthorized"
    }
}
```

### Response (404 Resource Not Found, measurement):

```ts
{
    error: {
        code: 404
        message: "Measurement was not found"
        param: {
            name: "measurementId" // measurement id
        }
    }
}
```

### Response (404 Resource Not Found, param):

```ts
{
    error: {
        code: 404
        message: "Param was not found"
        param: [
            {
                name: "measurementId" // measurement id
            },
            {
                name: "param" // param name
            }
        ]
    }
}
```
