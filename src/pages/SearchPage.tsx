import PublicHeader from "@/components/common/PublicHeader";
import { useGetPickListValues } from "@/features/picklist/picklist.hook";
import { useGetSearchResults } from "@/features/search/search.hooks";
import SearchInput from "@/features/search/SearchInput";

export default function SearchPage() {
  const { data, isPending, isError } = useGetSearchResults();
  // const {
  //   pickListData: allSemester,
  //   isGettingPickListValuesLoading: isSemesterLoading,
  // } = useGetPickListValues("semester");
  // const {
  //   pickListData: allCountries,
  //   isGettingPickListValuesLoading: isCountryLoading,
  // } = useGetPickListValues("country");
  // const {
  //   pickListData: allDegree,
  //   isGettingPickListValuesLoading: isDegreeLoading,
  // } = useGetPickListValues("degree_type");

  const results = data?.data?.data?.data;

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <PublicHeader />

      {/* MAIN Section */}
      <section className="px-5">
        <SearchInput />
      </section>
    </main>
  );
}
