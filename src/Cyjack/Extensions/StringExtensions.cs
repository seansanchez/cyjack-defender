namespace Cyjack.Extensions
{
    public static class StringExtensions
    {
        public static void ShouldNotBeNullOrEmpty(this string source, string name)
        {
            if (string.IsNullOrEmpty(source))
            {
                throw new ArgumentException($"{name} should not be null or empty.");
            }
        }

        public static void ShouldNotBeNullOrWhiteSpace(this string source, string name)
        {
            if (string.IsNullOrWhiteSpace(source))
            {
                throw new ArgumentException($"{name} should not be null or whitespace.");
            }
        }
    }
}
