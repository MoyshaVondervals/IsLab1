# DeleteApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteCaveById**](#deletecavebyid) | **DELETE** /deleteCaveById/{id} | Удалить пещеру|
|[**deleteCoordinatesById**](#deletecoordinatesbyid) | **DELETE** /deleteCoordinatesById/{id} | Удалить координаты|
|[**deleteHeadById**](#deleteheadbyid) | **DELETE** /deleteHeadById/{id} | Удалить голову дракона|
|[**deleteLocationById**](#deletelocationbyid) | **DELETE** /deleteLocationById/{id} | Удалить локацию|
|[**deletePersonById**](#deletepersonbyid) | **DELETE** /deletePersonById/{id} | Удалить персонажа|

# **deleteCaveById**
> string deleteCaveById()

Удаляет пещеру по идентификатору. Если пещера используется — вернёт 400.

### Example

```typescript
import {
    DeleteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeleteApi(configuration);

let id: number; //ID пещеры (default to undefined)

const { status, data } = await apiInstance.deleteCaveById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID пещеры | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**400** | Нельзя удалить: есть зависимости |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCoordinatesById**
> string deleteCoordinatesById()

Удаляет координаты по идентификатору. Если координаты используются — вернёт 400.

### Example

```typescript
import {
    DeleteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeleteApi(configuration);

let id: number; //ID координат (default to undefined)

const { status, data } = await apiInstance.deleteCoordinatesById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID координат | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**400** | Нельзя удалить: есть зависимости |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteHeadById**
> string deleteHeadById()

Удаляет голову по идентификатору. Если используется — вернёт 400.

### Example

```typescript
import {
    DeleteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeleteApi(configuration);

let id: number; //ID головы (default to undefined)

const { status, data } = await apiInstance.deleteHeadById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID головы | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**400** | Нельзя удалить: есть зависимости |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteLocationById**
> string deleteLocationById()

Удаляет локацию по идентификатору. Если используется — вернёт 400.

### Example

```typescript
import {
    DeleteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeleteApi(configuration);

let id: number; //ID локации (default to undefined)

const { status, data } = await apiInstance.deleteLocationById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID локации | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**400** | Нельзя удалить: есть зависимости |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePersonById**
> string deletePersonById()

Удаляет персонажа по идентификатору. Если используется как убийца — вернёт 400.

### Example

```typescript
import {
    DeleteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeleteApi(configuration);

let id: number; //ID персонажа (default to undefined)

const { status, data } = await apiInstance.deletePersonById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID персонажа | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Удалено |  -  |
|**400** | Нельзя удалить: есть зависимости |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

