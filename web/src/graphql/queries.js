/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getApplicationOrganization = /* GraphQL */ `
  query GetApplicationOrganization($id: ID!) {
    getApplicationOrganization(id: $id) {
      id
      username
      name
      registeredName
      taxIdNumber
      description
      phoneNumber
      email
      address {
        county
        district
        street
        zipCode
      }
      comments {
        createdAt
        createdBy
        comment
      }
      status
      createdAt
      updatedAt
    }
  }
`;
export const listApplicationOrganizations = /* GraphQL */ `
  query ListApplicationOrganizations(
    $filter: ModelApplicationOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationOrganizations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        name
        registeredName
        taxIdNumber
        description
        phoneNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        comments {
          createdAt
          createdBy
          comment
        }
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($key: String!, $timestamp: AWSDateTime!) {
    getEvent(key: $key, timestamp: $timestamp) {
      key
      timestamp
      organizationId
      updatedBy
      eventId
      eventName
      diff {
        key
        old
        new
      }
      note
      createdAt
      updatedAt
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $key: String
    $timestamp: ModelStringKeyConditionInput
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listEvents(
      key: $key
      timestamp: $timestamp
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        key
        timestamp
        organizationId
        updatedBy
        eventId
        eventName
        diff {
          key
          old
          new
        }
        note
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrganization = /* GraphQL */ `
  query GetOrganization($id: ID!) {
    getOrganization(id: $id) {
      id
      name
      description
      registeredName
      taxIdNumber
      phoneNumber
      email
      address {
        county
        district
        street
        zipCode
      }
      isActive
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;
export const listOrganizations = /* GraphQL */ `
  query ListOrganizations(
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrganizations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        registeredName
        taxIdNumber
        phoneNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
      nextToken
    }
  }
`;
export const getOrganizationGroup = /* GraphQL */ `
  query GetOrganizationGroup($organizationId: ID!, $id: ID!) {
    getOrganizationGroup(organizationId: $organizationId, id: $id) {
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
          email
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
export const listOrganizationGroups = /* GraphQL */ `
  query ListOrganizationGroups(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationGroupFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationGroups(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        id
        name
        isActive
        description
        createdBy
        createdAt
        updatedAt
        users {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getOrganizationProgram = /* GraphQL */ `
  query GetOrganizationProgram($organizationId: ID!, $id: ID!) {
    getOrganizationProgram(organizationId: $organizationId, id: $id) {
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
export const listOrganizationPrograms = /* GraphQL */ `
  query ListOrganizationPrograms(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationProgramFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationPrograms(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        id
        name
        isActive
        description
        createdBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrganizationReward = /* GraphQL */ `
  query GetOrganizationReward($organizationId: ID!, $id: ID!) {
    getOrganizationReward(organizationId: $organizationId, id: $id) {
      organizationId
      id
      name
      description
      requiredPoints
      isActive
      total
      createdBy
      createdAt
      updatedBy
      updatedAt
    }
  }
`;
export const listOrganizationRewards = /* GraphQL */ `
  query ListOrganizationRewards(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationRewardFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationRewards(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        id
        name
        description
        requiredPoints
        isActive
        total
        createdBy
        createdAt
        updatedBy
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrganizationTask = /* GraphQL */ `
  query GetOrganizationTask($organizationId: ID!, $id: ID!) {
    getOrganizationTask(organizationId: $organizationId, id: $id) {
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
export const listOrganizationTasks = /* GraphQL */ `
  query ListOrganizationTasks(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationTaskFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationTasks(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getOrganizationTransaction = /* GraphQL */ `
  query GetOrganizationTransaction($organizationId: ID!, $id: ID!) {
    getOrganizationTransaction(organizationId: $organizationId, id: $id) {
      organizationId
      id
      username
      rewardId
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
        email
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
          registeredName
          taxIdNumber
          phoneNumber
          email
          isActive
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
    }
  }
`;
export const listOrganizationTransactions = /* GraphQL */ `
  query ListOrganizationTransactions(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationTransactions(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        id
        username
        rewardId
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getOrganizationUser = /* GraphQL */ `
  query GetOrganizationUser($organizationId: ID!, $username: String!) {
    getOrganizationUser(organizationId: $organizationId, username: $username) {
      organizationId
      username
      idNumber
      name
      email
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
        registeredName
        taxIdNumber
        phoneNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;
export const listOrganizationUsers = /* GraphQL */ `
  query ListOrganizationUsers(
    $organizationId: ID
    $username: ModelStringKeyConditionInput
    $filter: ModelOrganizationUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationUsers(
      organizationId: $organizationId
      username: $username
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        organizationId
        username
        idNumber
        name
        email
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
          registeredName
          taxIdNumber
          phoneNumber
          email
          isActive
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
      nextToken
    }
  }
`;
export const getOrganizationUserTask = /* GraphQL */ `
  query GetOrganizationUserTask($organizationId: ID!, $id: ID!) {
    getOrganizationUserTask(organizationId: $organizationId, id: $id) {
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
        email
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
          registeredName
          taxIdNumber
          phoneNumber
          email
          isActive
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
      transaction {
        organizationId
        id
        username
        rewardId
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
          email
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
export const listOrganizationUserTasks = /* GraphQL */ `
  query ListOrganizationUserTasks(
    $organizationId: ID
    $id: ModelIDKeyConditionInput
    $filter: ModelOrganizationUserTaskFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOrganizationUserTasks(
      organizationId: $organizationId
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        transaction {
          organizationId
          id
          username
          rewardId
          refTransactionId
          isCancelled
          points
          type
          note
          createdBy
          createdAt
          updatedAt
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
        }
      }
      nextToken
    }
  }
`;
export const getTest = /* GraphQL */ `
  query GetTest($id: ID!) {
    getTest(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listTests = /* GraphQL */ `
  query ListTests(
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getApplicationByStatusByUpdate = /* GraphQL */ `
  query GetApplicationByStatusByUpdate(
    $status: ApplicationOrganizationStatus
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getApplicationByStatusByUpdate(
      status: $status
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        name
        registeredName
        taxIdNumber
        description
        phoneNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        comments {
          createdAt
          createdBy
          comment
        }
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEventsByOrgByTimestamp = /* GraphQL */ `
  query GetEventsByOrgByTimestamp(
    $organizationId: ID
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getEventsByOrgByTimestamp(
      organizationId: $organizationId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        key
        timestamp
        organizationId
        updatedBy
        eventId
        eventName
        diff {
          key
          old
          new
        }
        note
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrgTasksByProgramByActive = /* GraphQL */ `
  query GetOrgTasksByProgramByActive(
    $programId: ID
    $isActive: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getOrgTasksByProgramByActive(
      programId: $programId
      isActive: $isActive
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTransactionsByUserByCreatedAt = /* GraphQL */ `
  query GetTransactionsByUserByCreatedAt(
    $username: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTransactionsByUserByCreatedAt(
      username: $username
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        username
        rewardId
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getTransactionsByUserByOrganization = /* GraphQL */ `
  query GetTransactionsByUserByOrganization(
    $username: String
    $organizationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTransactionsByUserByOrganization(
      username: $username
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        username
        rewardId
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getTransactionsByRewardByDate = /* GraphQL */ `
  query GetTransactionsByRewardByDate(
    $rewardId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTransactionsByRewardByDate(
      rewardId: $rewardId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        id
        username
        rewardId
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getOrgUsersByGroupByActive = /* GraphQL */ `
  query GetOrgUsersByGroupByActive(
    $groupId: ID
    $isActive: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getOrgUsersByGroupByActive(
      groupId: $groupId
      isActive: $isActive
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        username
        idNumber
        name
        email
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
          registeredName
          taxIdNumber
          phoneNumber
          email
          isActive
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
      nextToken
    }
  }
`;
export const getOrgUsersByRoleByOrg = /* GraphQL */ `
  query GetOrgUsersByRoleByOrg(
    $role: RoleType
    $organizationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getOrgUsersByRoleByOrg(
      role: $role
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        organizationId
        username
        idNumber
        name
        email
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
          registeredName
          taxIdNumber
          phoneNumber
          email
          isActive
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
      nextToken
    }
  }
`;
export const getTasksByUserByCreatedAt = /* GraphQL */ `
  query GetTasksByUserByCreatedAt(
    $username: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationUserTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTasksByUserByCreatedAt(
      username: $username
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        transaction {
          organizationId
          id
          username
          rewardId
          refTransactionId
          isCancelled
          points
          type
          note
          createdBy
          createdAt
          updatedAt
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
        }
      }
      nextToken
    }
  }
`;
export const getTasksByUserByOrganization = /* GraphQL */ `
  query GetTasksByUserByOrganization(
    $username: String
    $organizationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationUserTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTasksByUserByOrganization(
      username: $username
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          email
          role
          groupId
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
        transaction {
          organizationId
          id
          username
          rewardId
          refTransactionId
          isCancelled
          points
          type
          note
          createdBy
          createdAt
          updatedAt
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
        }
      }
      nextToken
    }
  }
`;
