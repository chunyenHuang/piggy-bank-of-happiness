/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateApplicationOrganization = /* GraphQL */ `
  subscription OnCreateApplicationOrganization($username: String) {
    onCreateApplicationOrganization(username: $username) {
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
export const onUpdateApplicationOrganization = /* GraphQL */ `
  subscription OnUpdateApplicationOrganization($username: String) {
    onUpdateApplicationOrganization(username: $username) {
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
export const onDeleteApplicationOrganization = /* GraphQL */ `
  subscription OnDeleteApplicationOrganization($username: String) {
    onDeleteApplicationOrganization(username: $username) {
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
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent {
    onCreateEvent {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent {
    onUpdateEvent {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent {
    onDeleteEvent {
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
export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization {
    onCreateOrganization {
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
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization {
    onUpdateOrganization {
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
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization {
    onDeleteOrganization {
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
export const onCreateOrganizationGroup = /* GraphQL */ `
  subscription OnCreateOrganizationGroup {
    onCreateOrganizationGroup {
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
export const onUpdateOrganizationGroup = /* GraphQL */ `
  subscription OnUpdateOrganizationGroup {
    onUpdateOrganizationGroup {
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
export const onDeleteOrganizationGroup = /* GraphQL */ `
  subscription OnDeleteOrganizationGroup {
    onDeleteOrganizationGroup {
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
export const onCreateOrganizationProgram = /* GraphQL */ `
  subscription OnCreateOrganizationProgram {
    onCreateOrganizationProgram {
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
export const onUpdateOrganizationProgram = /* GraphQL */ `
  subscription OnUpdateOrganizationProgram {
    onUpdateOrganizationProgram {
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
export const onDeleteOrganizationProgram = /* GraphQL */ `
  subscription OnDeleteOrganizationProgram {
    onDeleteOrganizationProgram {
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
export const onCreateOrganizationReward = /* GraphQL */ `
  subscription OnCreateOrganizationReward {
    onCreateOrganizationReward {
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
export const onUpdateOrganizationReward = /* GraphQL */ `
  subscription OnUpdateOrganizationReward {
    onUpdateOrganizationReward {
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
export const onDeleteOrganizationReward = /* GraphQL */ `
  subscription OnDeleteOrganizationReward {
    onDeleteOrganizationReward {
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
export const onCreateOrganizationTask = /* GraphQL */ `
  subscription OnCreateOrganizationTask {
    onCreateOrganizationTask {
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
export const onUpdateOrganizationTask = /* GraphQL */ `
  subscription OnUpdateOrganizationTask {
    onUpdateOrganizationTask {
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
export const onDeleteOrganizationTask = /* GraphQL */ `
  subscription OnDeleteOrganizationTask {
    onDeleteOrganizationTask {
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
export const onCreateOrganizationTransaction = /* GraphQL */ `
  subscription OnCreateOrganizationTransaction {
    onCreateOrganizationTransaction {
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
export const onUpdateOrganizationTransaction = /* GraphQL */ `
  subscription OnUpdateOrganizationTransaction {
    onUpdateOrganizationTransaction {
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
export const onDeleteOrganizationTransaction = /* GraphQL */ `
  subscription OnDeleteOrganizationTransaction {
    onDeleteOrganizationTransaction {
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
export const onCreateOrganizationUser = /* GraphQL */ `
  subscription OnCreateOrganizationUser {
    onCreateOrganizationUser {
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
export const onUpdateOrganizationUser = /* GraphQL */ `
  subscription OnUpdateOrganizationUser {
    onUpdateOrganizationUser {
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
export const onDeleteOrganizationUser = /* GraphQL */ `
  subscription OnDeleteOrganizationUser {
    onDeleteOrganizationUser {
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
export const onCreateOrganizationUserTask = /* GraphQL */ `
  subscription OnCreateOrganizationUserTask {
    onCreateOrganizationUserTask {
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
export const onUpdateOrganizationUserTask = /* GraphQL */ `
  subscription OnUpdateOrganizationUserTask {
    onUpdateOrganizationUserTask {
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
export const onDeleteOrganizationUserTask = /* GraphQL */ `
  subscription OnDeleteOrganizationUserTask {
    onDeleteOrganizationUserTask {
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
export const onCreateTest = /* GraphQL */ `
  subscription OnCreateTest {
    onCreateTest {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTest = /* GraphQL */ `
  subscription OnUpdateTest {
    onUpdateTest {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTest = /* GraphQL */ `
  subscription OnDeleteTest {
    onDeleteTest {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
