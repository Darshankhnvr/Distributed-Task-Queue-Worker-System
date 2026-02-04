export const processTask = async (task) => {
    const { type, payload } = task;

    if (payload?.shouldFail) {
        console.log("Intentional failure");
    }

    if (type == "email") {
        console.log(`Sending email to ${payload.to}`)
    }

    if (type === "report") {
        console.log("Generating report...")
        await new Promise((res) => setTimeout(res, 3000))
    }

    if (type === "resize-image") {
        console.log("Resizing the image...")
    }
}