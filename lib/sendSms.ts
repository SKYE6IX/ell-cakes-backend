//

export async function sendSms({
  phoneNumber,
  message,
}: {
  phoneNumber: string;
  message: string;
}) {
  const smsBody = {
    number: process.env.SMS_SENDER,
    destination: phoneNumber,
    text: message,
  };

  try {
    const response = await fetch("https://api.exolve.ru/messaging/v1/SendSMS", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsBody),
    });

    const resJson = await response.json();
    return resJson;
  } catch (error) {
    console.log("Error -> ", error);
    throw new Error("Unable to send SMS!");
  }
}
