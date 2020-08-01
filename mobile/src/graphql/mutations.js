/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    createOrganization(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const updateOrganization = /* GraphQL */ `
  mutation UpdateOrganization(
    $input: UpdateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    updateOrganization(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrganization = /* GraphQL */ `
  mutation DeleteOrganization(
    $input: DeleteOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    deleteOrganization(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const createOrganizationGroup = /* GraphQL */ `
  mutation CreateOrganizationGroup(
    $input: CreateOrganizationGroupInput!
    $condition: ModelOrganizationGroupConditionInput
  ) {
    createOrganizationGroup(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      description
      createdBy
      createdAt
      updatedAt
      users {
        items {
          organizationId
          username
          idNumber
          name
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const updateOrganizationGroup = /* GraphQL */ `
  mutation UpdateOrganizationGroup(
    $input: UpdateOrganizationGroupInput!
    $condition: ModelOrganizationGroupConditionInput
  ) {
    updateOrganizationGroup(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      description
      createdBy
      createdAt
      updatedAt
      users {
        items {
          organizationId
          username
          idNumber
          name
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const deleteOrganizationGroup = /* GraphQL */ `
  mutation DeleteOrganizationGroup(
    $input: DeleteOrganizationGroupInput!
    $condition: ModelOrganizationGroupConditionInput
  ) {
    deleteOrganizationGroup(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      description
      createdBy
      createdAt
      updatedAt
      users {
        items {
          organizationId
          username
          idNumber
          name
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const createOrganizationProgram = /* GraphQL */ `
  mutation CreateOrganizationProgram(
    $input: CreateOrganizationProgramInput!
    $condition: ModelOrganizationProgramConditionInput
  ) {
    createOrganizationProgram(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      description
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const updateOrganizationProgram = /* GraphQL */ `
  mutation UpdateOrganizationProgram(
    $input: UpdateOrganizationProgramInput!
    $condition: ModelOrganizationProgramConditionInput
  ) {
    updateOrganizationProgram(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      description
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrganizationProgram = /* GraphQL */ `
  mutation DeleteOrganizationProgram(
    $input: DeleteOrganizationProgramInput!
    $condition: ModelOrganizationProgramConditionInput
  ) {
    deleteOrganizationProgram(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      description
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const createOrganizationTask = /* GraphQL */ `
  mutation CreateOrganizationTask(
    $input: CreateOrganizationTaskInput!
    $condition: ModelOrganizationTaskConditionInput
  ) {
    createOrganizationTask(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      programId
      description
      note
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
      program {
        organizationId
        id
        name
        isActive
        description
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const updateOrganizationTask = /* GraphQL */ `
  mutation UpdateOrganizationTask(
    $input: UpdateOrganizationTaskInput!
    $condition: ModelOrganizationTaskConditionInput
  ) {
    updateOrganizationTask(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      programId
      description
      note
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
      program {
        organizationId
        id
        name
        isActive
        description
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const deleteOrganizationTask = /* GraphQL */ `
  mutation DeleteOrganizationTask(
    $input: DeleteOrganizationTaskInput!
    $condition: ModelOrganizationTaskConditionInput
  ) {
    deleteOrganizationTask(input: $input, condition: $condition) {
      organizationId
      id
      name
      isActive
      programId
      description
      note
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
      program {
        organizationId
        id
        name
        isActive
        description
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const createOrganizationTransaction = /* GraphQL */ `
  mutation CreateOrganizationTransaction(
    $input: CreateOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    createOrganizationTransaction(input: $input, condition: $condition) {
      organizationId
      id
      username
      refTransactionId
      isCancelled
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
        name
        role
        groupId
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const updateOrganizationTransaction = /* GraphQL */ `
  mutation UpdateOrganizationTransaction(
    $input: UpdateOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    updateOrganizationTransaction(input: $input, condition: $condition) {
      organizationId
      id
      username
      refTransactionId
      isCancelled
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
        name
        role
        groupId
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const deleteOrganizationTransaction = /* GraphQL */ `
  mutation DeleteOrganizationTransaction(
    $input: DeleteOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    deleteOrganizationTransaction(input: $input, condition: $condition) {
      organizationId
      id
      username
      refTransactionId
      isCancelled
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
        name
        role
        groupId
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const createOrganizationUser = /* GraphQL */ `
  mutation CreateOrganizationUser(
    $input: CreateOrganizationUserInput!
    $condition: ModelOrganizationUserConditionInput
  ) {
    createOrganizationUser(input: $input, condition: $condition) {
      organizationId
      username
      idNumber
      name
      role
      groupId
      isActive
      currentPoints
      earnedPoints
      createdAt
      updatedAt
      organization {
        id
        name
        description
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;
export const updateOrganizationUser = /* GraphQL */ `
  mutation UpdateOrganizationUser(
    $input: UpdateOrganizationUserInput!
    $condition: ModelOrganizationUserConditionInput
  ) {
    updateOrganizationUser(input: $input, condition: $condition) {
      organizationId
      username
      idNumber
      name
      role
      groupId
      isActive
      currentPoints
      earnedPoints
      createdAt
      updatedAt
      organization {
        id
        name
        description
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;
export const deleteOrganizationUser = /* GraphQL */ `
  mutation DeleteOrganizationUser(
    $input: DeleteOrganizationUserInput!
    $condition: ModelOrganizationUserConditionInput
  ) {
    deleteOrganizationUser(input: $input, condition: $condition) {
      organizationId
      username
      idNumber
      name
      role
      groupId
      isActive
      currentPoints
      earnedPoints
      createdAt
      updatedAt
      organization {
        id
        name
        description
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;
export const createOrganizationUserTask = /* GraphQL */ `
  mutation CreateOrganizationUserTask(
    $input: CreateOrganizationUserTaskInput!
    $condition: ModelOrganizationUserTaskConditionInput
  ) {
    createOrganizationUserTask(input: $input, condition: $condition) {
      organizationId
      id
      taskId
      taskName
      username
      status
      note
      transactionId
      points
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
        name
        role
        groupId
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        isCancelled
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          idNumber
          name
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        id
        name
        isActive
        programId
        description
        note
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
        program {
          organizationId
          id
          name
          isActive
          description
          createdBy
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const updateOrganizationUserTask = /* GraphQL */ `
  mutation UpdateOrganizationUserTask(
    $input: UpdateOrganizationUserTaskInput!
    $condition: ModelOrganizationUserTaskConditionInput
  ) {
    updateOrganizationUserTask(input: $input, condition: $condition) {
      organizationId
      id
      taskId
      taskName
      username
      status
      note
      transactionId
      points
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
        name
        role
        groupId
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        isCancelled
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          idNumber
          name
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        id
        name
        isActive
        programId
        description
        note
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
        program {
          organizationId
          id
          name
          isActive
          description
          createdBy
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const deleteOrganizationUserTask = /* GraphQL */ `
  mutation DeleteOrganizationUserTask(
    $input: DeleteOrganizationUserTaskInput!
    $condition: ModelOrganizationUserTaskConditionInput
  ) {
    deleteOrganizationUserTask(input: $input, condition: $condition) {
      organizationId
      id
      taskId
      taskName
      username
      status
      note
      transactionId
      points
      createdAt
      updatedAt
      user {
        organizationId
        username
        idNumber
        name
        role
        groupId
        isActive
        currentPoints
        earnedPoints
        createdAt
        updatedAt
        organization {
          id
          name
          description
          isActive
          createdAt
          updatedAt
        }
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        isCancelled
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          idNumber
          name
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        id
        name
        isActive
        programId
        description
        note
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
        program {
          organizationId
          id
          name
          isActive
          description
          createdBy
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const createTest = /* GraphQL */ `
  mutation CreateTest(
    $input: CreateTestInput!
    $condition: ModelTestConditionInput
  ) {
    createTest(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateTest = /* GraphQL */ `
  mutation UpdateTest(
    $input: UpdateTestInput!
    $condition: ModelTestConditionInput
  ) {
    updateTest(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteTest = /* GraphQL */ `
  mutation DeleteTest(
    $input: DeleteTestInput!
    $condition: ModelTestConditionInput
  ) {
    deleteTest(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
