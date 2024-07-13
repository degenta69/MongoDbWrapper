# MongoDB Node.js Driver Wrapper for AWS Lambda

This module is a simple wrapper around the MongoDB Node.js driver, designed specifically for use with AWS Lambda. It provides easy-to-use functions to manage connections to a MongoDB Atlas cluster from within a serverless environment.

## Table of Contents

- [Introduction](#introduction)
- [Functions](#functions)
  - [connect](#connect)
  - [disconnect](#disconnect)
  - [executeInTransaction](#executeintransaction)
  - [insertOne](#insertone)
  - [insertMany](#insertmany)
  - [find](#find)
  - [findOne](#findone)
  - [updateOne](#updateone)
  - [deleteOne](#deleteone)

## Introduction

This wrapper simplifies the process of connecting your AWS Lambda functions to a MongoDB Atlas database. It manages the database connection, making it easy to perform CRUD operations without worrying about connection pooling or handling connection timeouts.

## Functions

### connect

**Description**: Establishes a connection to the MongoDB Atlas cluster.

```typescript
await mongoDBWrapper.connect();
```

### disconnect
**Description**: Closes the connection to the MongoDB Atlas cluster.

```typescript
await mongoDBWrapper.disconnect();
```

### executeInTransaction
**Description**: Executes a provided function within a MongoDB transaction.

```typescript
await mongoDBWrapper.executeInTransaction(async (session) => {
  // Your transactional code here
});
```
- **Parameters**: _func_ - A function to be executed within the transaction.

### insertOne
**Description**: Inserts a single document into a specified collection.

```typescript
await mongoDBWrapper.insertOne('collectionName', document);
```
- **Parameters**: _collectionName_ - The name of the collection where the document will be inserted. _doc_ - The document to be inserted.

### insertMany
**Description**: Inserts multiple documents into a specified collection.

```typescript
await mongoDBWrapper.insertMany('collectionName', documents);
```
- **Parameters**: _collectionName_ - The name of the collection where the documents will be inserted. _docs_ - An array of documents to be inserted.

### find
**Description**: Finds documents in a specified collection based on a query filter.

```typescript
const documents = await mongoDBWrapper.find('collectionName', queryOptions);
```
- **Parameters**: _collectionName_ - The name of the collection to query. queryOptions - An object containing query options such as filter, skip, limit, sort, and projection.

### findOne
**Description**:  Finds a single document in a specified collection based on a query filter.

```typescript
const document = await mongoDBWrapper.findOne('collectionName', queryOptions);
```
- **Parameters**: _collectionName_ - The name of the collection to query. queryOptions - An object containing query options such as filter and projection.

### updateOne
**Description**:  Updates a single document in a specified collection based on a query filter.

```typescript
const result = await mongoDBWrapper.updateOne('collectionName', filter, update);
```
- **Parameters**: _collectionName_ - The name of the collection to update. filter - The filter criteria to identify the document to update. update - The update operations to apply to the document.

### deleteOne
**Description**: Deletes a single document from a specified collection based on a query filter.

```typescript
const result = await mongoDBWrapper.deleteOne('collectionName', filter);
```
- **Parameters**: _collectionName_ - The name of the collection to delete from. filter - The filter criteria to identify the document to delete.
