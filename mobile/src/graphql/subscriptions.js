/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization {
    onCreateOrganization {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization {
    onUpdateOrganization {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization {
    onDeleteOrganization {
      id
      name
      description
      isActive
      createdAt
      updatedAt
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
export const onUpdateOrganizationTransaction = /* GraphQL */ `
  subscription OnUpdateOrganizationTransaction {
    onUpdateOrganizationTransaction {
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
export const onDeleteOrganizationTransaction = /* GraphQL */ `
  subscription OnDeleteOrganizationTransaction {
    onDeleteOrganizationTransaction {
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
export const onCreateOrganizationUser = /* GraphQL */ `
  subscription OnCreateOrganizationUser {
    onCreateOrganizationUser {
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
export const onUpdateOrganizationUser = /* GraphQL */ `
  subscription OnUpdateOrganizationUser {
    onUpdateOrganizationUser {
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
export const onDeleteOrganizationUser = /* GraphQL */ `
  subscription OnDeleteOrganizationUser {
    onDeleteOrganizationUser {
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
