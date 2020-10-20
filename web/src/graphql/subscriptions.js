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
      createdBy
      updatedAt
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
      createdBy
      updatedAt
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
      createdBy
      updatedAt
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
          createdBy
          updatedAt
          updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
          createdBy
          updatedAt
          updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
          createdBy
          updatedAt
          updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      note
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      note
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      note
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
      program {
        organizationId
        id
        name
        isActive
        description
        createdAt
        createdBy
        updatedAt
        updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
      program {
        organizationId
        id
        name
        isActive
        description
        createdAt
        createdBy
        updatedAt
        updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
      program {
        organizationId
        id
        name
        isActive
        description
        createdAt
        createdBy
        updatedAt
        updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
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
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
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
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
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
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
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
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
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
        createdAt
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
          updatedBy
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
        createdAt
        createdBy
        updatedAt
        updatedBy
        program {
          organizationId
          id
          name
          isActive
          description
          createdAt
          createdBy
          updatedAt
          updatedBy
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
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
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
        createdAt
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
          updatedBy
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
        createdAt
        createdBy
        updatedAt
        updatedBy
        program {
          organizationId
          id
          name
          isActive
          description
          createdAt
          createdBy
          updatedAt
          updatedBy
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
      createdBy
      updatedAt
      updatedBy
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
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
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
        createdAt
        createdBy
        updatedAt
        updatedBy
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
          createdBy
          updatedAt
          updatedBy
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
        createdAt
        createdBy
        updatedAt
        updatedBy
        program {
          organizationId
          id
          name
          isActive
          description
          createdAt
          createdBy
          updatedAt
          updatedBy
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
