# GetApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCaves**](#getcaves) | **GET** /getCaves | Получить пещеры|
|[**getCoordinates**](#getcoordinates) | **GET** /getCoordinates | Получить координаты|
|[**getHeads**](#getheads) | **GET** /getHead | Получить головы драконов|
|[**getLocations**](#getlocations) | **GET** /getLocation | Получить локации|
|[**getPersons**](#getpersons) | **GET** /getPerson | Получить персонажей|

# **getCaves**
> Array<DragonCaveDTO> getCaves()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

const { status, data } = await apiInstance.getCaves();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<DragonCaveDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCoordinates**
> Array<CoordinatesDTO> getCoordinates()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

const { status, data } = await apiInstance.getCoordinates();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CoordinatesDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHeads**
> Array<DragonHeadDTO> getHeads()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

const { status, data } = await apiInstance.getHeads();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<DragonHeadDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLocations**
> Array<LocationDTO> getLocations()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

const { status, data } = await apiInstance.getLocations();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<LocationDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPersons**
> Array<PersonDTO> getPersons()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

const { status, data } = await apiInstance.getPersons();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<PersonDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

