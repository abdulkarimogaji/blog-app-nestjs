# Introduction

Blognado API was built from the ground-up with a REST API that makes it easy for developers and and users to have access to blog data stored in a MongoDB database

These docs describe how to use the [BLOGNADO](https://blognado.vercel.app) API. We hope you enjoy these docs, and please don't hesitate to [file an issue](https://github.com/AbdulkarimOgaji/blog-app-nestjs/issues/new) if you see anything missing.


## Use Cases

There are many reasons to use the BLOGNADO API. The most common use case is to access blogs and comments for use in some Single Page Applications


## Authorization

Some API requests require the use of a generated API key. You can find your API key, or generate a new one, by navigating to the /signup endpoint or regenerate key with /login endpoint providing a valid email address and password.

To authenticate an API request, you should provide your API key in the `Authorization` header.


```http
POST /comments
```

| Authorization Type|  Example |
| :--- | :--- |
| `Bearer` `token` | Bearer **Your token**|

## Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, Gophish returns a JSON response in the following format:

```javascript
{
  "message" : string,
  "status" : int,
  "data"    : string
}
```

The `message` attribute contains a message commonly used to indicate errors or, in the case of creating or deleting a resource, success that the resource was properly deleted.

The `success` attribute describes the status code of the response.

The `data` attribute contains any other metadata associated with the response. This will be an escaped string containing JSON data.

## Status Codes

BLOGNADO returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 401 | `UNAUTHORIZED` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |




## Endpoints

### Get list of Blogs

#### Request
```http
GET /blogs
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | `integer` | Page Number |
| `limit` | `integer` | Number of Blogs |
| `tag` | `string` | Filter's blogs my tags  |

#### Response

```typescript
{
  "message" : "blogs fetched successfully",
  "data"    : BlogType[] // Check the types below
}
```


### Search Blogs 

#### Request

```http
GET /blogs/search
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | `integer` | Page Number |
| `limit` | `integer` | Number of Blogs |
| `tag` | `string` | Filter's blogs my tags  |
| `searchKey` | `string` | **Required** search term|

#### Response

```typescript
{
  "message" : "blogs fetched successfully",
  "data"    : BlogType[] // Check the types below
}
```

### Create Blog

#### Request
```http
POST /blogs
```

| Request Body | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Blog Title |
| `isAnonymous` | `bool` | Write blog as anonymous |
| `tags` | `string[]` | List of tags  |

#### Response

```typescript
{
  "message" : "blog created successfully",
  "data"    : BlogType // Check the types below
}
```
### Create User

#### Request
```http
POST /users
```

| Request Body | Type | Description |
| :--- | :--- | :--- |
| `firstName` | `string` | First Name |
| `lastName` | `string` | Last Name |
| `password` | `string` | **Required** Password |
| `phone` | `string` | Phone Number |
| `email` | `string` | **Required** Email Address |

#### Response

```typescript
{
  "message" : "blog created successfully",
  "data"    : UserType // Check the types below
}
```