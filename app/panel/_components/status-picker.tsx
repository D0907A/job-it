// inside your ApplicationsList item rendering...
import { updateApplicationStatus } from "@/actions/application";
import { APPLICATION_STATUSES } from "@/constants";

function StatusPicker({ appId, current }: { appId: string; current: string }) {
    const [status, setStatus] = useState(current);
    const [updating, setUpdating] = useState(false);

    const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as keyof typeof APPLICATION_STATUSES[number];
        setUpdating(true);
        await updateApplicationStatus(appId, newStatus);
        setStatus(newStatus);
        setUpdating(false);
    };

    return (
        <select
            value={status}
            onChange={onChange}
            disabled={updating}
            className="rounded border px-2 py-1 text-sm"
        >
            {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s[0] + s.slice(1).toLowerCase()}
                </option>
            ))}
        </select>
    );
}
