import Button from "@/components/Button/Button";
import ConfettiBackground from "@/components/ConfettiBackground/FireworksBackground";


export default function Homepage() {
    

    return (
        <div>
            <ConfettiBackground />
            <Button variant="primary" onClick={() => console.log("Hello!")}>
                Primary Button
            </Button>
        </div>
    );
}
