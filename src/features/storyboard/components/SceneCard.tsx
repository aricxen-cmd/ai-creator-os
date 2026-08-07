import { StoryboardScene } from "../types";

interface Props {
  scene: StoryboardScene;
}

export default function SceneCard({
  scene,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="mb-4 text-xl font-bold">
        🎬 Scene {scene.id}
      </h2>

      <div className="space-y-4">

        <div>
          <h3 className="font-semibold">Narration</h3>
          <p>{scene.narration}</p>
        </div>

        <div>
          <h3 className="font-semibold">Visual</h3>
          <p>{scene.visual}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <h3 className="font-semibold">
              Camera
            </h3>

            <p>{scene.camera}</p>
          </div>

          <div>
            <h3 className="font-semibold">
              Motion
            </h3>

            <p>{scene.motion}</p>
          </div>

          <div>
            <h3 className="font-semibold">
              Duration
            </h3>

            <p>{scene.duration}</p>
          </div>

          <div>
            <h3 className="font-semibold">
              Transition
            </h3>

            <p>{scene.transition}</p>
          </div>

        </div>

      </div>
    </div>
  );
}