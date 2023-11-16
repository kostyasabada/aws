import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./client.mjs";

export const TABLE_NAME = "Goals";
export const goalClient = {
  findGoalById: async (id) => {
    const getGoalByIdCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id,
      }
    });
    const foundGoal = await ddbDocClient
      .send(getGoalByIdCommand)
      .catch(err => { console.error(err); throw error; });
    return parseGoal(foundGoal.Item);
  },
  findAllGoals: async () => {
    const scanGoalsCommand = new ScanCommand({ TableName: TABLE_NAME });
    const allGoals = await ddbDocClient
      .send(scanGoalsCommand)
      .catch(err => { console.error(err); return null; });
    return (allGoals?.Items ?? []).map(parseGoal)
  },
  createGoal: async (goalToBeCreated) => {
    const goalItem = goalToBeCreated;
    const putGoalItemCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: goalItem
    });
    await ddbDocClient
      .send(putGoalItemCommand)
      .catch(err => { console.error(err); throw err; });;
    return goalClient.findGoalById(goalToBeCreated.id);
  }
}

function parseGoal(goal) {
  if (goal === null || goal === undefined) {
    return null;
  }

  return {
      ...goal,
      savedAmount: goal?.savedAmount ?? 0
    }
}