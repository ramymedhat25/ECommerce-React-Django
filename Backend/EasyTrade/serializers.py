from rest_framework import serializers
from .models import Category, Product, ProductImage, Order, Review, Wishlist, PayPal


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def get_User_name(self, obj):
        return obj.User.id if obj.User else None


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'


class PayPalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPal
        fields = ['id', 'name', 'address', 'email', 'card_number', 'exp_date', 'cvv', 'total_items', 'total_amount', 'created_at']