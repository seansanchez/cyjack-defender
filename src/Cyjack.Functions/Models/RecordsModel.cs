using Newtonsoft.Json;

namespace Cyjack.Functions.Models
{
    public class RecordsModel
    {
        [JsonProperty("records")]
        public IEnumerable<RecordModel> Records { get; set; }
    }
}