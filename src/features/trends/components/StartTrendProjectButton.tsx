"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  TrendFormat,
} from "../data/trendCatalog";

import {
  createTrendProject,
} from "../services/createTrendProject";

interface Props {
  format: TrendFormat;
}

interface TrendControl {
  key: string;

  label: string;

  placeholder?: string;

  type?:
    | "text"
    | "select";

  options?: string[];

  required?: boolean;
}

/*
 * Each Trend Format can expose
 * completely different controls.
 */
function getTrendControls(
  format: TrendFormat
): TrendControl[] {
  switch (
    format.id
  ) {
    case "animal-haircut":
      return [
        {
          key:
            "clientAnimal",

          label:
            "Client Animal",

          placeholder:
            "Golden retriever",

          required:
            true,
        },

        {
          key:
            "barberAnimal",

          label:
            "Barber Animal",

          placeholder:
            "Chimpanzee barber",

          required:
            true,
        },

        {
          key:
            "haircutStyle",

          label:
            "Haircut Style",

          placeholder:
            "Lion cut",
        },
      ];

    case "anatomy-fitness":
      return [
        {
          key:
            "exercise",

          label:
            "Exercise / Problem",

          placeholder:
            "Incorrect lateral raise",
        },

        {
          key:
            "visualLayer",

          label:
            "Primary Visual Layer",

          type:
            "select",

          options: [
            "Porcelain",
            "X-Ray",
            "Muscle",
            "Mixed Layers",
          ],
        },
      ];

    case "body-science":
      return [
        {
          key:
            "bodyAction",

          label:
            "Body Action / Question",

          placeholder:
            "Stop drinking soda for 30 days",
        },

        {
          key:
            "visualSystem",

          label:
            "Anatomy Style",

          type:
            "select",

          options: [
            "Transparent Cutaway",
            "X-Ray",
            "Organ View",
            "Muscle View",
            "Mixed Anatomy",
          ],
        },
      ];

    case "cat-story":
      return [
        {
          key:
            "protagonist",

          label:
            "Main Cat",

          placeholder:
            "Poor orange cat",
        },

        {
          key:
            "villain",

          label:
            "Rival / Villain",

          placeholder:
            "Rich white cat",
        },

        {
          key:
            "ending",

          label:
            "Ending Type",

          type:
            "select",

          options: [
            "Karma",
            "Revenge",
            "Emotional Payoff",
            "Comeback",
            "Cliffhanger",
          ],
        },
      ];

    case "car-evolution":
      return [
        {
          key:
            "car",

          label:
            "Vehicle",

          placeholder:
            "Ford Mustang",

          required:
            true,
        },

        {
          key:
            "startYear",

          label:
            "Start Year",

          placeholder:
            "1965",
        },

        {
          key:
            "endYear",

          label:
            "End Year",

          placeholder:
            "2026",
        },
      ];

    case "restoration":
      return [
        {
          key:
            "subject",

          label:
            "What Are We Restoring?",

          placeholder:
            "Abandoned roadside diner",
        },

        {
          key:
            "location",

          label:
            "Location",

          placeholder:
            "Nevada desert",
        },

        {
          key:
            "finalStyle",

          label:
            "Finished Style",

          placeholder:
            "1950s retro diner",
        },
      ];

    case "clay-story":
      return [
        {
          key:
            "cast",

          label:
            "Main Cast",

          placeholder:
            "Two brothers and their dog",
        },

        {
          key:
            "storyEngine",

          label:
            "Story Engine",

          type:
            "select",

          options: [
            "Mystery",
            "Conflict",
            "Adventure",
            "Comedy",
            "Horror",
            "Cliffhanger",
          ],
        },
      ];

    case "brainrot":
      return [
        {
          key:
            "mainCharacter",

          label:
            "Main Character",

          placeholder:
            "Ballerina Cappuccina",
        },

        {
          key:
            "storyMode",

          label:
            "Story Mode",

          type:
            "select",

          options: [
            "Chase",
            "Karma",
            "Competition",
            "Betrayal",
            "Rescue",
            "Chaos",
          ],
        },
      ];

    case "talking-objects":
      return [
        {
          key:
            "object",

          label:
            "Talking Object",

          placeholder:
            "Coffee cup",

          required:
            true,
        },

        {
          key:
            "personality",

          label:
            "Personality",

          type:
            "select",

          options: [
            "Sarcastic",
            "Grumpy",
            "Dramatic",
            "Motivational",
            "Anxious",
            "Savage",
            "Confused",
            "Overconfident",
          ],

          required:
            true,
        },

        {
          key:
            "contentMode",

          label:
            "Content Mode",

          type:
            "select",

          options: [
            "Roast",
            "Advice",
            "Story",
            "Argument",
            "Confession",
            "Comedy",
          ],
        },
      ];

    case "weirdcore-story":
      return [
        {
          key:
            "location",

          label:
            "Liminal Location",

          placeholder:
            "Empty shopping mall at midnight",

          required:
            true,
        },

        {
          key:
            "mystery",

          label:
            "Central Mystery",

          placeholder:
            "The same hallway keeps repeating",
        },

        {
          key:
            "ending",

          label:
            "Ending",

          type:
            "select",

          options: [
            "Disturbing Reveal",
            "Loop Ending",
            "Unanswered Mystery",
            "Escape",
            "False Reality",
          ],
        },
      ];

    case "gen-z-story":
      return [
        {
          key:
            "mainCharacter",

          label:
            "Main Character",

          placeholder:
            "22-year-old college student",
        },

        {
          key:
            "setting",

          label:
            "Setting",

          type:
            "select",

          options: [
            "Apartment",
            "Workplace",
            "College",
            "Gym",
            "Cafe",
            "Party",
            "Car",
            "Store",
          ],
        },

        {
          key:
            "storyType",

          label:
            "Story Type",

          type:
            "select",

          options: [
            "Dating Disaster",
            "Roommate Drama",
            "Workplace Drama",
            "Friendship",
            "Money Problem",
            "Social Media",
            "Embarrassment",
          ],
        },
      ];

    case "micro-camera-animals":
      return [
        {
          key:
            "animal",

          label:
            "Animal",

          placeholder:
            "Fire ant",

          required:
            true,
        },

        {
          key:
            "environment",

          label:
            "Environment",

          placeholder:
            "Underground colony",

          required:
            true,
        },

        {
          key:
            "discovery",

          label:
            "Final Discovery",

          placeholder:
            "Queen chamber",
        },

        {
          key:
            "narration",

          label:
            "Narration",

          type:
            "select",

          options: [
            "Documentary Voice",
            "No Narration",
            "POV Story",
          ],
        },
      ];

    case "sports-star-reveal":
      return [
        {
          key:
            "sport",

          label:
            "Sport",

          type:
            "select",

          options: [
            "Football",
            "Basketball",
            "Baseball",
            "Boxing",
            "MMA",
            "Soccer",
            "Hockey",
          ],

          required:
            true,
        },

        {
          key:
            "athlete",

          label:
            "Athlete / Team",

          placeholder:
            "Enter athlete or team",

          required:
            true,
        },

        {
          key:
            "teamColors",

          label:
            "Team Colors",

          placeholder:
            "Red, black and white",
        },

        {
          key:
            "location",

          label:
            "Venue",

          placeholder:
            "Packed stadium",
        },
      ];

    case "game-universe-premiere":
      return [
        {
          key:
            "cast",

          label:
            "Main Cast",

          placeholder:
            "3 recurring characters",

          required:
            true,
        },

        {
          key:
            "scenario",

          label:
            "Scenario",

          type:
            "select",

          options: [
            "Red Carpet Premiere",
            "Nightclub Arrival",
            "Luxury Garage",
            "Police Lineup",
            "Rooftop Meeting",
            "Downtown Arrival",
            "Street Race",
            "Mansion Entrance",
          ],

          required:
            true,
        },

        {
          key:
            "location",

          label:
            "Location",

          placeholder:
            "Neon downtown district",
        },
      ];

    default:
      return [];
  }
}

function buildInitialOptions(
  controls: TrendControl[]
) {
  const values: Record<
    string,
    string
  > = {};

  controls.forEach(
    (
      control
    ) => {
      if (
        control.type ===
          "select" &&
        control.options?.length
      ) {
        values[
          control.key
        ] =
          control.options[0];
      } else {
        values[
          control.key
        ] = "";
      }
    }
  );

  return values;
}

export default function StartTrendProjectButton({
  format,
}: Props) {
  const router =
    useRouter();

  const controls =
    getTrendControls(
      format
    );

  const [
    topic,
    setTopic,
  ] = useState("");

  const [
    duration,
    setDuration,
  ] = useState(
    format.durations[0] ??
      ""
  );

  const [
    options,
    setOptions,
  ] = useState<
    Record<
      string,
      string
    >
  >(
    buildInitialOptions(
      controls
    )
  );

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * Reset the form if this
   * component receives another
   * Trend Format.
   */
  useEffect(() => {
    setTopic("");

    setDuration(
      format.durations[0] ??
        ""
    );

    setOptions(
      buildInitialOptions(
        getTrendControls(
          format
        )
      )
    );

    setError("");
  }, [
    format,
  ]);

  function updateOption(
    key: string,
    value: string
  ) {
    setOptions(
      (
        current
      ) => ({
        ...current,

        [key]:
          value,
      })
    );

    setError("");
  }

  function validateControls() {
    for (
      const control of
      controls
    ) {
      if (
        control.required &&
        !options[
          control.key
        ]?.trim()
      ) {
        return `${control.label} is required.`;
      }
    }

    return "";
  }

  async function handleCreate() {
    if (!topic.trim()) {
      setError(
        "Enter the video topic you want to create."
      );

      return;
    }

    if (!duration) {
      setError(
        "Choose a duration."
      );

      return;
    }

    const controlError =
      validateControls();

    if (controlError) {
      setError(
        controlError
      );

      return;
    }

    setCreating(
      true
    );

    setError("");

    try {
      const project =
        await createTrendProject(
          {
            format,

            topic,

            duration,

            options,
          }
        );

      if (!project?.id) {
        throw new Error(
          "Project ID was not returned."
        );
      }

      /*
       * Trend workflow begins
       * with Research.
       */
      router.push(
        `/projects/${project.id}/research`
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create project."
      );
    } finally {
      setCreating(
        false
      );
    }
  }

  return (
    <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Start Production
        </p>

        <h2 className="mt-2 text-xl font-bold text-zinc-100">
          Create with this
          format
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Configure the trend,
          create a project, and
          carry these choices
          through the production
          workflow.
        </p>
      </div>

      {/* TOPIC */}

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Video Topic
        </label>

        <textarea
          value={
            topic
          }
          onChange={(
            event
          ) => {
            setTopic(
              event.target.value
            );

            setError("");
          }}
          rows={4}
          placeholder={
            getTopicPlaceholder(
              format
            )
          }
          disabled={
            creating
          }
          className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-500 disabled:opacity-50"
        />
      </div>

      {/* DURATION */}

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Duration
        </label>

        <div className="flex flex-wrap gap-2">
          {format.durations.map(
            (
              item
            ) => (
              <button
                key={
                  item
                }
                type="button"
                disabled={
                  creating
                }
                onClick={() => {
                  setDuration(
                    item
                  );

                  setError("");
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  duration ===
                  item
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                    : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {
                  item
                }
              </button>
            )
          )}
        </div>
      </div>

      {/* FORMAT CONTROLS */}

      {controls.length >
        0 && (
        <div className="mt-6 border-t border-zinc-800 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Format Controls
          </p>

          <div className="mt-4 space-y-4">
            {controls.map(
              (
                control
              ) => (
                <TrendControlField
                  key={
                    control.key
                  }
                  control={
                    control
                  }
                  value={
                    options[
                      control.key
                    ] ?? ""
                  }
                  disabled={
                    creating
                  }
                  onChange={(
                    value
                  ) =>
                    updateOption(
                      control.key,
                      value
                    )
                  }
                />
              )
            )}
          </div>
        </div>
      )}

      {/* CONTRACT PREVIEW */}

      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Production Contract
        </p>

        <div className="mt-3 space-y-2 text-sm">
          <ContractLine
            label="Format"
            value={
              format.title
            }
          />

          <ContractLine
            label="Duration"
            value={
              duration ||
              "Not selected"
            }
          />

          <ContractLine
            label="Structure"
            value={
              format.structureFamily
            }
          />

          <ContractLine
            label="Audio"
            value={
              format.audioMode
            }
          />

          <ContractLine
            label="Style"
            value={
              format.style
            }
          />

          <ContractLine
            label="Model"
            value={
              format.recommendedModel
            }
          />
        </div>

        {Object.entries(
          options
        ).some(
          ([
            ,
            value,
          ]) =>
            Boolean(
              value.trim()
            )
        ) && (
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
              Format Selections
            </p>

            <div className="space-y-2">
              {controls.map(
                (
                  control
                ) => {
                  const value =
                    options[
                      control.key
                    ];

                  if (
                    !value?.trim()
                  ) {
                    return null;
                  }

                  return (
                    <ContractLine
                      key={
                        control.key
                      }
                      label={
                        control.label
                      }
                      value={
                        value
                      }
                    />
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-400">
          {
            error
          }
        </div>
      )}

      {/* START */}

      <button
        type="button"
        onClick={
          handleCreate
        }
        disabled={
          creating ||
          !topic.trim() ||
          !duration
        }
        className="mt-5 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {creating
          ? "Creating Project..."
          : "🚀 Start Project"}
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-600">
        <span>
          Trend
        </span>

        <span>
          →
        </span>

        <span>
          Research
        </span>

        <span>
          →
        </span>

        <span>
          Script
        </span>

        <span>
          →
        </span>

        <span>
          Storyboard
        </span>

        <span>
          →
        </span>

        <span>
          Scenes
        </span>
      </div>
    </div>
  );
}

function TrendControlField({
  control,
  value,
  disabled,
  onChange,
}: {
  control: TrendControl;

  value: string;

  disabled: boolean;

  onChange:
    (
      value: string
    ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {
          control.label
        }

        {control.required && (
          <span className="ml-1 text-emerald-500">
            *
          </span>
        )}
      </label>

      {control.type ===
      "select" ? (
        <select
          value={
            value
          }
          disabled={
            disabled
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-emerald-500 disabled:opacity-50"
        >
          {control.options?.map(
            (
              option
            ) => (
              <option
                key={
                  option
                }
                value={
                  option
                }
              >
                {
                  option
                }
              </option>
            )
          )}
        </select>
      ) : (
        <input
          value={
            value
          }
          disabled={
            disabled
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            control.placeholder
          }
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-500 disabled:opacity-50"
        />
      )}
    </div>
  );
}

function ContractLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-zinc-600">
        {
          label
        }
      </span>

      <span className="max-w-[60%] text-right font-medium capitalize text-zinc-300">
        {
          value
        }
      </span>
    </div>
  );
}

function getTopicPlaceholder(
  format: TrendFormat
) {
  switch (
    format.id
  ) {
    case "animal-haircut":
      return "A fluffy golden retriever gets a dramatic lion haircut";

    case "anatomy-fitness":
      return "What happens when you perform lateral raises incorrectly?";

    case "body-science":
      return "What happens inside your body when you stop drinking soda for 30 days?";

    case "cat-story":
      return "Poor orange cat gets mocked, disappears, then returns successful";

    case "car-evolution":
      return "Ford Mustang evolution from 1965 to 2026";

    case "restoration":
      return "Restore an abandoned 1950s roadside diner";

    case "clay-story":
      return "Two brothers discover a locked door underneath their house";

    case "brainrot":
      return "A stolen pizza starts a ridiculous citywide chase";

    case "talking-objects":
      return "A coffee cup finally tells its owner what it thinks about their morning routine";

    case "weirdcore-story":
      return "A teenager enters an empty mall where every clock shows the same time";

    case "gen-z-story":
      return "A roommate secretly spends the rent money before moving day";

    case "micro-camera-animals":
      return "Follow a fire ant deep inside its underground colony";

    case "sports-star-reveal":
      return "Cinematic stadium reveal for a superstar athlete";

    case "game-universe-premiere":
      return "A fictional crime-game cast arrives at a massive red-carpet premiere";

    default:
      return `Create a ${format.title} video...`;
  }
}