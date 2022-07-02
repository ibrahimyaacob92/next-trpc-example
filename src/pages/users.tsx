import { userInfo } from "os";
import { useQuery } from "../utils/trpc";

const UserPage = () => {
  const { data, error, isLoading } = useQuery(["users.get-users"]);
  return (
    <div>
      <p>User List</p>
      {data?.map((user) => (
        <p key={`user=${user.id}`}>
          {user.name} - {user.id} - {user.email}
        </p>
      ))}
    </div>
  );
};

export default UserPage;
