import { useParams } from "react-router-dom";
export default function VlogPage() {
    const { id } = useParams();
    return (
        <div>
            <h2>Vlog Details</h2>
            <p>Here you can watch the vlog video with ID: {id}</p>
        </div>
    );
}
