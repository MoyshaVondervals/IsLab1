# DragonApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createDragon**](#createdragon) | **POST** /createDragon | Создать дракона|
|[**deleteDragonById**](#deletedragonbyid) | **DELETE** /deleteDragonById/{id} | Удалить дракона по ID|
|[**getDragonById**](#getdragonbyid) | **GET** /getDragonById/{id} | Получить дракона по ID|
|[**getDragons**](#getdragons) | **GET** /getDragons | Получить всех драконов|
|[**updateDragonById**](#updatedragonbyid) | **PUT** /updateDragonById/{id} | Обновить дракона по ID|

# **createDragon**
> string createDragon(newDragonResp)

Создаёт дракона на основании составного запроса. Отправляет обновлённый список по WebSocket.

### Example

```typescript
import {
    DragonApi,
    Configuration,
    NewDragonResp
} from './api';

const configuration = new Configuration();
const apiInstance = new DragonApi(configuration);

let newDragonResp: NewDragonResp; //Данные для создания дракона

const { status, data } = await apiInstance.createDragon(
    newDragonResp
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **newDragonResp** | **NewDragonResp**| Данные для создания дракона | |


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Создано |  -  |
|**500** | Внутренняя ошибка |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteDragonById**
> string deleteDragonById()

Удаляет дракона, отправляет обновлённый список по WebSocket.

### Example

```typescript
import {
    DragonApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DragonApi(configuration);

let id: number; //ID дракона (default to undefined)

const { status, data } = await apiInstance.deleteDragonById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID дракона | defaults to undefined|


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
|**201** | Удалено (сайд-эффект отправки списка) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDragonById**
> Dragon getDragonById()

Возвращает дракона по идентификатору.

### Example

```typescript
import {
    DragonApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DragonApi(configuration);

let id: number; //ID дракона (default to undefined)

const { status, data } = await apiInstance.getDragonById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID дракона | defaults to undefined|


### Return type

**Dragon**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Найден |  -  |
|**404** | Не найден |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDragons**
> Array<Dragon> getDragons()

Возвращает полный список драконов.

### Example

```typescript
import {
    DragonApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DragonApi(configuration);

const { status, data } = await apiInstance.getDragons();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Dragon>**

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

# **updateDragonById**
> DragonDTO updateDragonById(dragon)

Обновляет данные дракона и возвращает DTO.

### Example

```typescript
import {
    DragonApi,
    Configuration,
    Dragon
} from './api';

const configuration = new Configuration();
const apiInstance = new DragonApi(configuration);

let id: number; //ID дракона (default to undefined)
let dragon: Dragon; //Обновлённые данные дракона

const { status, data } = await apiInstance.updateDragonById(
    id,
    dragon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dragon** | **Dragon**| Обновлённые данные дракона | |
| **id** | [**number**] | ID дракона | defaults to undefined|


### Return type

**DragonDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Обновлено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

