namespace Cyjack.Extensions
{
    public static class StringExtensions
    {
        public static void ShouldNotBeNullOrEmpty(string source, string name)
        {
            if (string.IsNullOrEmpty(source))
            {
                throw new ArgumentException($"{name} should not be null or empty.");
            }
        }

        public static void ShouldNotBeNullOrWhitespace(string source, string name)
        {
            if (string.IsNullOrWhiteSpace(source))
            {
                throw new ArgumentException($"{name} should not be null or whitespace.");
            }
        }
    }
}
