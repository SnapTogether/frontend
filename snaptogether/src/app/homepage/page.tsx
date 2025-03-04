import Button from "@/components/Button/Button";

export default function Homepage() {
    

    return (
        <div>
            <Button variant="primary" onClick={() => console.log("Hello!")}>
                Primary Button
            </Button>
        </div>
    );
}
