interface AddressValidationInput {
  addressLines: string[];
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  countryCode?: string;
}

interface AddressValidationResult {
  valid: boolean;
  formattedAddress: string;
  formattedAddressLines: string[];
  verdict: {
    addressComplete: boolean;
    hasUnconfirmedComponents: boolean;
    hasInferredComponents: boolean;
    hasReplacedComponents: boolean;
  };
  components?: {
    streetNumber?: string;
    route?: string;
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    country?: string;
    subpremise?: string;
  };
}

export async function validateAddress(
  input: AddressValidationInput
): Promise<AddressValidationResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  if (!apiKey) {
    console.warn(
      "[google-maps] GOOGLE_MAPS_SERVER_API_KEY not set — skipping validation"
    );
    return null;
  }

  const payload = {
    address: {
      regionCode: input.countryCode ?? "ZA",
      addressLines: input.addressLines.filter(Boolean),
      ...(input.locality && { locality: input.locality }),
      ...(input.administrativeArea && {
        administrativeArea: input.administrativeArea,
      }),
      ...(input.postalCode && { postalCode: input.postalCode }),
    },
    enableUspsCass: false,
  };

  try {
    const res = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(
        "[google-maps] validation failed:",
        res.status,
        text.slice(0, 300)
      );
      return null;
    }

    const data = await res.json();
    const result = data.result;
    const verdict = result?.verdict ?? {};
    const address = result?.address ?? {};
    const components = address.addressComponents ?? [];

    const get = (type: string) =>
      components.find(
        (c: { componentType: string }) =>
          c.componentType === type ||
          c.componentType === `street_${type}`
      )?.componentName?.text;

    return {
      valid: verdict.addressComplete === true,
      formattedAddress:
        address.formattedAddress ?? input.addressLines.join(", "),
      formattedAddressLines:
        address.postalAddress?.addressLines ?? input.addressLines,
      verdict: {
        addressComplete: verdict.addressComplete ?? false,
        hasUnconfirmedComponents: verdict.hasUnconfirmedComponents ?? false,
        hasInferredComponents: verdict.hasInferredComponents ?? false,
        hasReplacedComponents: verdict.hasReplacedComponents ?? false,
      },
      components: {
        streetNumber: get("street_number"),
        route: get("route"),
        locality: get("locality"),
        administrativeArea: get("administrative_area_level_1"),
        postalCode: get("postal_code"),
        country: get("country"),
        subpremise: get("subpremise"),
      },
    };
  } catch (err) {
    console.error("[google-maps] validation error:", err);
    return null;
  }
}