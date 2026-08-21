type PromptTemplate = {
  name?: string;
  category?: string;
  type?: string;
  default_model?: string;
  default_style?: string;
  aspect_ratio?: string;
  prompt_template?: string;
  tags?: string[];
  requires_reference_image?: boolean;
};

// Keep searching independent from the removed database module.
function getPromptTemplates(): PromptTemplate[] {
  return [];
}

export interface PromptSearchFilters {
  search?: string;
  category?: string;
  type?: string;
  model?: string;
  requiresReferenceImage?: boolean;
}

function normalize(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export function searchPrompts(
  filters: PromptSearchFilters = {}
): PromptTemplate[] {
  const templates = getPromptTemplates();

  const search = normalize(filters.search);
  const category = normalize(filters.category);
  const type = normalize(filters.type);
  const model = normalize(filters.model);

  return templates.filter((template) => {
    if (
      category &&
      normalize(template.category) !== category
    ) {
      return false;
    }

    if (
      type &&
      normalize(template.type) !== type
    ) {
      return false;
    }

    if (
      model &&
      normalize(template.default_model) !== model
    ) {
      return false;
    }

    if (
      typeof filters.requiresReferenceImage ===
        "boolean" &&
      Boolean(template.requires_reference_image) !==
        filters.requiresReferenceImage
    ) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      template.name,
      template.category,
      template.type,
      template.default_model,
      template.default_style,
      template.aspect_ratio,
      template.prompt_template,
      ...(template.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}