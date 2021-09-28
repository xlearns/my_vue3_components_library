export default{
  string(d?: string) {
    return {
      type: String,
      default: d
    }
  },
  boolean(d?:boolean){
    return {
      type:Boolean,
      default:d
    }
  }
}