import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { locationsAPI } from '../../../api/locations';
import { itemsAPI } from '../../../api/items';

const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  location_id: z.string().min(1, 'Location is required'),
  supplier_id: z.string().optional(),
  purchase_date: z.string().optional(),
  condition: z.enum(['baik', 'rusak ringan', 'rusak berat']),
});

const AssetForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsAPI.getAll(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: initialData || {
      condition: 'baik',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Asset Name"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input
          label="Asset Code"
          {...register('code')}
          error={errors.code?.message}
        />
      </div>

      <Input
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            {...register('category_id')}
            className="input-field"
          >
            <option value="">Select Category</option>
            {/* You'll need to fetch categories similar to locations */}
          </select>
          {errors.category_id && (
            <p className="text-sm text-red-600">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            {...register('location_id')}
            className="input-field"
          >
            <option value="">Select Location</option>
            {locations?.data?.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errors.location_id && (
            <p className="text-sm text-red-600">{errors.location_id.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Purchase Date"
          type="date"
          {...register('purchase_date')}
          error={errors.purchase_date?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            {...register('condition')}
            className="input-field"
          >
            <option value="baik">Good</option>
            <option value="rusak ringan">Minor Damage</option>
            <option value="rusak berat">Major Damage</option>
          </select>
          {errors.condition && (
            <p className="text-sm text-red-600">{errors.condition.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {initialData ? 'Update Asset' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
};

export default AssetForm;