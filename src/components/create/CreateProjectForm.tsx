async function createProject(topic: string) {
  try {
    setLoading(true);

    // 1. Create the project
    const projectResponse = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: topic,
        description: `AI video about ${topic}`,
      }),
    });

    const project = await projectResponse.json();

    if (!projectResponse.ok) {
      throw new Error(project.error || "Failed to create project");
    }

    console.log("PROJECT CREATED:", project);


    // 2. Generate research
    const researchResponse = await fetch("/api/ai/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
      }),
    });

    const researchData = await researchResponse.json();

    if (!researchResponse.ok) {
      throw new Error(
        researchData.error || "Failed to generate research"
      );
    }

    console.log("RESEARCH GENERATED:", researchData);


    // 3. Save research to project
    const saveResponse = await fetch("/api/projects/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: project.id,
        research: researchData.research,
      }),
    });

    const savedProject = await saveResponse.json();

    if (!saveResponse.ok) {
      throw new Error(
        savedProject.error || "Failed to save research"
      );
    }

    console.log("RESEARCH SAVED:", savedProject);

    alert("Project and research created successfully!");

  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
}

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
