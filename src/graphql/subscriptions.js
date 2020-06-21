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
export const onCreateOrganizationTask = /* GraphQL */ `
  subscription OnCreateOrganizationTask {
    onCreateOrganizationTask {
      organizationId
      name
      isActive
      programName
      description
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOrganizationTask = /* GraphQL */ `
  subscription OnUpdateOrganizationTask {
    onUpdateOrganizationTask {
      organizationId
      name
      isActive
      programName
      description
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOrganizationTask = /* GraphQL */ `
  subscription OnDeleteOrganizationTask {
    onDeleteOrganizationTask {
      organizationId
      name
      isActive
      programName
      description
      point
      pointMin
      pointMax
      createdBy
      createdAt
      updatedAt
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
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        name
        role
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
        tasks {
          nextToken
        }
        transactions {
          nextToken
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
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        name
        role
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
        tasks {
          nextToken
        }
        transactions {
          nextToken
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
      points
      type
      note
      createdBy
      createdAt
      updatedAt
      user {
        organizationId
        username
        name
        role
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
        tasks {
          nextToken
        }
        transactions {
          nextToken
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
      name
      role
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
      tasks {
        items {
          organizationId
          id
          taskName
          username
          status
          note
          transactionId
          points
          createdAt
          updatedAt
        }
        nextToken
      }
      transactions {
        items {
          organizationId
          id
          username
          refTransactionId
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onUpdateOrganizationUser = /* GraphQL */ `
  subscription OnUpdateOrganizationUser {
    onUpdateOrganizationUser {
      organizationId
      username
      name
      role
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
      tasks {
        items {
          organizationId
          id
          taskName
          username
          status
          note
          transactionId
          points
          createdAt
          updatedAt
        }
        nextToken
      }
      transactions {
        items {
          organizationId
          id
          username
          refTransactionId
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onDeleteOrganizationUser = /* GraphQL */ `
  subscription OnDeleteOrganizationUser {
    onDeleteOrganizationUser {
      organizationId
      username
      name
      role
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
      tasks {
        items {
          organizationId
          id
          taskName
          username
          status
          note
          transactionId
          points
          createdAt
          updatedAt
        }
        nextToken
      }
      transactions {
        items {
          organizationId
          id
          username
          refTransactionId
          points
          type
          note
          createdBy
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onCreateOrganizationUserTask = /* GraphQL */ `
  subscription OnCreateOrganizationUserTask {
    onCreateOrganizationUserTask {
      organizationId
      id
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
        name
        role
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
        tasks {
          nextToken
        }
        transactions {
          nextToken
        }
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        name
        isActive
        programName
        description
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const onUpdateOrganizationUserTask = /* GraphQL */ `
  subscription OnUpdateOrganizationUserTask {
    onUpdateOrganizationUserTask {
      organizationId
      id
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
        name
        role
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
        tasks {
          nextToken
        }
        transactions {
          nextToken
        }
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        name
        isActive
        programName
        description
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
export const onDeleteOrganizationUserTask = /* GraphQL */ `
  subscription OnDeleteOrganizationUserTask {
    onDeleteOrganizationUserTask {
      organizationId
      id
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
        name
        role
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
        tasks {
          nextToken
        }
        transactions {
          nextToken
        }
      }
      transaction {
        organizationId
        id
        username
        refTransactionId
        points
        type
        note
        createdBy
        createdAt
        updatedAt
        user {
          organizationId
          username
          name
          role
          isActive
          currentPoints
          earnedPoints
          createdAt
          updatedAt
        }
      }
      task {
        organizationId
        name
        isActive
        programName
        description
        point
        pointMin
        pointMax
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
