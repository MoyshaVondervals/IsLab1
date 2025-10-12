# AuthenticationApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authSignIn**](#authsignin) | **POST** /auth/sign-in | Вход пользователя|
|[**authSignUp**](#authsignup) | **POST** /auth/sign-up | Регистрация пользователя|

# **authSignIn**
> AuthRespForm authSignIn(signInRequest)

Аутентифицирует пользователя и возвращает форму ответа (обычно с JWT).

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    SignInRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let signInRequest: SignInRequest; //Данные для входа

const { status, data } = await apiInstance.authSignIn(
    signInRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signInRequest** | **SignInRequest**| Данные для входа | |


### Return type

**AuthRespForm**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешная аутентификация |  -  |
|**401** | Неверные учётные данные |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authSignUp**
> AuthRespForm authSignUp(signUpRequest)

Создаёт нового пользователя и возвращает форму ответа с токеном/данными.

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    SignUpRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let signUpRequest: SignUpRequest; //Данные для регистрации

const { status, data } = await apiInstance.authSignUp(
    signUpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpRequest** | **SignUpRequest**| Данные для регистрации | |


### Return type

**AuthRespForm**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Пользователь создан |  -  |
|**400** | Ошибка валидации |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

