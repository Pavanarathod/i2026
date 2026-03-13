import { useQuery } from "@tanstack/react-query";
import { getLandingPageCategoriesData, getPrograms } from "./lading.api";
import { useSearchParams } from "react-router-dom";
import { buildFormData, offersData } from "@/lib/utils";

export function useGetProgramsList() {
  const [searchParams] = useSearchParams();
  const degreeType = searchParams.get("degreeType") ?? "Masters";
  const semesterType =
    searchParams.getAll("semester").length > 0
      ? searchParams.getAll("semester")
      : "Fall";

  // Get all values of 'country' and default to ['USA'] if none exist
  const countryType =
    searchParams.getAll("country").length > 0
      ? searchParams.getAll("country")
      : "USA";

  const selectedCategory =
    searchParams.getAll("category").length > 0
      ? searchParams.getAll("category")
      : ["All"];

  const selectedCategoryDecoded = selectedCategory.map((c) =>
    decodeURIComponent(c),
  );

  let addOns: Record<any, boolean> = {};

  offersData?.forEach((o) => {
    if (selectedCategoryDecoded.includes(o)) {
      addOns[o] = true;
    } else {
      addOns[o] = false;
    }
  });

  const payloadData = {
    degree_type: degreeType,
    semester: semesterType,
    country: countryType,
    category: JSON.stringify(addOns),
  };

  const payload = buildFormData(payloadData as any);

  const { data: programs, isLoading: isGettingProgramsLoading } = useQuery({
    queryKey: ["homepageProgramsAPI", payloadData],
    queryFn: () => getPrograms(payload),
  });

  return {
    programs,
    isGettingProgramsLoading,
  };
}
export function useGetProgramCategories(type: string = "Related Programs") {
  const [searchParams] = useSearchParams();
  const selectedProgram = decodeURIComponent(searchParams.get("program") ?? "");
  const degreeType = searchParams.get("degree_type") ?? "";
  const semester = searchParams.get("semester") ?? "";

  const payloadData = {
    type: type,
    degreeType: degreeType,
    semester: semester,
    program: selectedProgram,
  };

  const payload = buildFormData(payloadData);

  const {
    data: relatedProgramData,
    isLoading: isGettingRelatedProgramLoading,
  } = useQuery({
    queryKey: ["relatedProgramsAPI", payloadData],
    queryFn: () => getLandingPageCategoriesData(payload),
  });

  return {
    relatedProgramData,
    isGettingRelatedProgramLoading,
  };
}

export function useGetGeneralProgram() {}
