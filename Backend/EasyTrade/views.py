from django.shortcuts import render
from .models import Category, Product, Order, Review, Wishlist
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    OrderSerializer,
    ReviewSerializer,
    WishlistSerializer,
)
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Order
from .serializers import PayPalSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category
from .serializers import CategorySerializer
from django.http import JsonResponse


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer


class CheckoutAPIView(APIView):
    def post(self, request, format=None):
        serializer = PayPalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


# class CategoryList(APIView):
#     def get(self, request, format=None):
#         categories = Category.objects.all()
#         serializer = CategorySerializer(categories, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = CategorySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class CategoryDetail(APIView):
#     def get_object(self, pk):
#         try:
#             return Category.objects.get(pk=pk)
#         except Category.DoesNotExist:
#             raise Http404

#     def get(self, request, pk, format=None):
#         category = self.get_object(pk)
#         serializer = CategorySerializer(category)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         category = self.get_object(pk)
#         serializer = CategorySerializer(category, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         category = self.get_object(pk)
#         category.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


from django.http import JsonResponse
from .models import Product


def get_products(request):
    products = Product.objects.all()
    base_url = request.build_absolute_uri("/")[:-1]
    data = []
    for product in products:
        category_name = product.category.name if product.category else None
        data.append(
            {
                "id": product.id,
                "title": product.title,
                "description": product.description,
                "price": str(product.price),
                "discountPercentage": str(product.discountPercentage),
                "rating": str(product.rating),
                "stock": product.stock,
                "brand": product.brand,
                "category_name": category_name,  # Just passing category_name instead of product.category
                "thumbnail": base_url + product.thumbnail.url,
            }
        )
    return JsonResponse(data, safe=False)


from django.http import JsonResponse
from .models import Product

from django.http import JsonResponse
from .models import Product, ProductImage

from django.http import JsonResponse
from .models import Product, ProductImage


def get_product_by_id(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        images = ProductImage.objects.filter(product=product)

        image_urls = [
            request.build_absolute_uri("/")[:-1] + image.image.url for image in images
        ]

        category_name = product.category.name if product.category else None

        data = {
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "price": str(product.price),
            "discountPercentage": str(product.discountPercentage),
            "rating": str(product.rating),
            "stock": product.stock,
            "brand": product.brand,
            "category_name": category_name,
            "thumbnail": request.build_absolute_uri("/")[:-1] + product.thumbnail.url,
            "images": image_urls,
        }
        return JsonResponse(data)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)


from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def products_by_category(request, category):
    try:
        products = Product.objects.filter(category__name=category)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"message": "Products not found for this category"}, status=404)


from rest_framework import generics
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer
from django.shortcuts import get_object_or_404


class ProductByCategoryAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_name = self.kwargs["category"]
        category = get_object_or_404(Category, name=category_name)
        return Product.objects.filter(category=category)


from django.db.models import Q
from django.conf import settings


@api_view(["GET"])
def search_products(request):
    search_term = request.query_params.get("q", None)
    if search_term is not None:
        products = Product.objects.filter(
            Q(title__icontains=search_term) | Q(description__icontains=search_term)
        )
        serializer = ProductSerializer(products, many=True)
        return Response({"products": serializer.data})
    else:
        return Response({"products": []})


from rest_framework import generics
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer


class ProductSearchAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        search_term = self.request.query_params.get("q", "")
        if search_term:
            return Product.objects.filter(title__icontains=search_term)
        else:
            return Product.objects.all()


from django.http import JsonResponse
from django.db.models import Q
from .models import Product, ProductImage

from rest_framework.response import Response
from django.db.models import Q


@api_view(["GET"])
def search(request):
    search_term = request.query_params.get("q", None)
    if search_term is not None:
        products = Product.objects.filter(
            Q(title__icontains=search_term)
            | Q(description__icontains=search_term)
            | Q(brand__icontains=search_term)
        )

        data = []
        for product in products:
            product_data = {
                "id": product.id,
                "title": product.title,
                "description": product.description,
                "price": str(product.price),
                "discountPercentage": str(product.discountPercentage),
                "rating": str(product.rating),
                "stock": product.stock,
                "brand": product.brand,
                "thumbnail": request.build_absolute_uri("/")[:-1]
                + product.thumbnail.url,
            }
            data.append(product_data)

        return Response({"products": data})
    else:
        return Response({"products": []})
