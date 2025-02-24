import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
        },
    ]
});

export const UserModel = model('User', userSchema);