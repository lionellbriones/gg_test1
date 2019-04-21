import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate";

const SchemaOptions = {
  timestamps: {
    createdAt: "DateCreated",
    updatedAt: "DateUpdated"
  }
};

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."]
    },
    account_type: {
      type: String,
      required: [true, "Price is required."]
    }
    // product_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "product",
    //   required: [true, "Product ID is required"]
    // }
  },
  SchemaOptions
);

UserSchema.plugin(paginate);

export const User = model("Users", UserSchema);
