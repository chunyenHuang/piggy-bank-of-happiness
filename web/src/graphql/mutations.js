/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userOperation = /* GraphQL */ `
  mutation UserOperation($input: UserOperationRequest!) {
    userOperation(input: $input) {
      errors
      organizationUsers {
        organizationId
        username
      }
    }
  }
`;
export const adminUpdatePoint = /* GraphQL */ `
  mutation AdminUpdatePoint($input: AdminUpdatePointRequest!) {
    adminUpdatePoint(input: $input) {
      errors
      message
    }
  }
`;
export const createOrganizationApplication = /* GraphQL */ `
  mutation CreateOrganizationApplication(
    $input: CreateOrganizationApplicationRequest!
  ) {
    createOrganizationApplication(input: $input) {
      errors
      message
    }
  }
`;
export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    createOrganization(input: $input, condition: $condition) {
      id
      username
      name
      registeredName
      description
      taxIdNumber
      phoneNumber
      faxNumber
      email
      address {
        county
        district
        street
        zipCode
      }
      principal {
        name
        title
        phoneNumber
        email
      }
      status
      isActive
      note
      notes
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
          createdAt
          createdBy
          updatedAt
          updatedBy
        }
      }
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      username
      name
      registeredName
      description
      taxIdNumber
      phoneNumber
      faxNumber
      email
      address {
        county
        district
        street
        zipCode
      }
      principal {
        name
        title
        phoneNumber
        email
      }
      status
      isActive
      note
      notes
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
          createdAt
          createdBy
          updatedAt
          updatedBy
        }
      }
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      username
      name
      registeredName
      description
      taxIdNumber
      phoneNumber
      faxNumber
      email
      address {
        county
        district
        street
        zipCode
      }
      principal {
        name
        title
        phoneNumber
        email
      }
      status
      isActive
      note
      notes
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
          createdAt
          createdBy
          updatedAt
          updatedBy
        }
      }
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
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
      createdAt
      createdBy
      updatedAt
      updatedBy
    }
  }
`;
export const createOrganizationReward = /* GraphQL */ `
  mutation CreateOrganizationReward(
    $input: CreateOrganizationRewardInput!
    $condition: ModelOrganizationRewardConditionInput
  ) {
    createOrganizationReward(input: $input, condition: $condition) {
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
export const updateOrganizationReward = /* GraphQL */ `
  mutation UpdateOrganizationReward(
    $input: UpdateOrganizationRewardInput!
    $condition: ModelOrganizationRewardConditionInput
  ) {
    updateOrganizationReward(input: $input, condition: $condition) {
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
export const deleteOrganizationReward = /* GraphQL */ `
  mutation DeleteOrganizationReward(
    $input: DeleteOrganizationRewardInput!
    $condition: ModelOrganizationRewardConditionInput
  ) {
    deleteOrganizationReward(input: $input, condition: $condition) {
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
export const createOrganizationTransaction = /* GraphQL */ `
  mutation CreateOrganizationTransaction(
    $input: CreateOrganizationTransactionInput!
    $condition: ModelOrganizationTransactionConditionInput
  ) {
    createOrganizationTransaction(input: $input, condition: $condition) {
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
          createdAt
          createdBy
          updatedAt
          updatedBy
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
          createdAt
          createdBy
          updatedAt
          updatedBy
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
          createdAt
          createdBy
          updatedAt
          updatedBy
        }
      }
    }
  }
`;
export const createOrganizationTransactionApplication = /* GraphQL */ `
  mutation CreateOrganizationTransactionApplication(
    $input: CreateOrganizationTransactionApplicationInput!
    $condition: ModelOrganizationTransactionApplicationConditionInput
  ) {
    createOrganizationTransactionApplication(
      input: $input
      condition: $condition
    ) {
      id
      organizationId
      username
      status
      type
      transactionId
      rewardId
      rewardAmount
      taskId
      taskName
      points
      description
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
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
    }
  }
`;
export const updateOrganizationTransactionApplication = /* GraphQL */ `
  mutation UpdateOrganizationTransactionApplication(
    $input: UpdateOrganizationTransactionApplicationInput!
    $condition: ModelOrganizationTransactionApplicationConditionInput
  ) {
    updateOrganizationTransactionApplication(
      input: $input
      condition: $condition
    ) {
      id
      organizationId
      username
      status
      type
      transactionId
      rewardId
      rewardAmount
      taskId
      taskName
      points
      description
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
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
    }
  }
`;
export const deleteOrganizationTransactionApplication = /* GraphQL */ `
  mutation DeleteOrganizationTransactionApplication(
    $input: DeleteOrganizationTransactionApplicationInput!
    $condition: ModelOrganizationTransactionApplicationConditionInput
  ) {
    deleteOrganizationTransactionApplication(
      input: $input
      condition: $condition
    ) {
      id
      organizationId
      username
      status
      type
      transactionId
      rewardId
      rewardAmount
      taskId
      taskName
      points
      description
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
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
        username
        name
        registeredName
        description
        taxIdNumber
        phoneNumber
        faxNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        principal {
          name
          title
          phoneNumber
          email
        }
        status
        isActive
        note
        notes
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
        createdAt
        createdBy
        updatedAt
        updatedBy
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
        username
        name
        registeredName
        description
        taxIdNumber
        phoneNumber
        faxNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        principal {
          name
          title
          phoneNumber
          email
        }
        status
        isActive
        note
        notes
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
        createdAt
        createdBy
        updatedAt
        updatedBy
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
        username
        name
        registeredName
        description
        taxIdNumber
        phoneNumber
        faxNumber
        email
        address {
          county
          district
          street
          zipCode
        }
        principal {
          name
          title
          phoneNumber
          email
        }
        status
        isActive
        note
        notes
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
        createdAt
        createdBy
        updatedAt
        updatedBy
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
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
          username
          name
          registeredName
          description
          taxIdNumber
          phoneNumber
          faxNumber
          email
          status
          isActive
          note
          notes
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
