import { getMyApplications } from "@/actions/my-applications";
import { MyApplicationsList } from "./_components/my-applications-list";

const MyApplicationsPage = async () => {
    const myApplications = await getMyApplications();

    return (
        <div className="p-6">
            <MyApplicationsList applications={myApplications} />
        </div>
    );
};

export default MyApplicationsPage;
