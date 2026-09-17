export async function incrementVision(id: string) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/news/view/${id}` , {
        method: "POST"
      }
    );
     await response.json();
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}
